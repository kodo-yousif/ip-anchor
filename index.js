const fs =  require('fs')
const os = require('os')
const path = require('path')
const sudo = require('sudo-prompt')
const { exec } = require('child_process')

const args = process.argv.slice(2)

// Regular expression for validating IP address
const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const ip = args[0]
if (!ipRegex.test(ip)) {
    console.error(
        'Invalid IP address format. Please provide a valid IPv4 address.'
    )
    process.exit(1)
}

// Regular expression for validating domain name
const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
const domain = args[1]
if (!domainRegex.test(domain)) {
    console.error(
        'Invalid domain name format. Please provide a valid domain name.'
    )
    process.exit(1)
}
const platform = os.platform()

const run = (command) =>
    new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return
            }
            resolve(stdout ? stdout : stderr)
        })
    })

async function isMkcertInstalled() {
    try {
        await run('mkcert -version')
        return true
    } catch {
        return false
    }
}

async function installMkcert() {
    try {
        if (await isMkcertInstalled()) {
            console.log('mkcert is already installed.')
            return
        }

        let installCmd

        if (platform === 'darwin' || platform === 'linux')
            installCmd = 'brew install mkcert' //  macOS and Linux ( Homebrew )
        else if (platform === 'win32')
            installCmd = 'choco install mkcert -y' // windows ( Chocolatey )
        else throw new Error(`Unsupported platform: ${platform}`)

        console.log('Installing mkcert...')
        console.log(installCmd)
        await run(installCmd)
        console.log('mkcert installed successfully.')
    } catch (error) {
        console.error('Error installing mkcert:', error)
    }
}

async function setupCertificates() {
    try {
        console.log('Installing local CA...')
        await run('mkcert -install')

        // Create a directory for certificates if it doesn't exist
        const certDir = path.join('.', '.cert')
        if (!fs.existsSync(certDir)) {
            fs.mkdirSync(certDir, { recursive: true })
        }

        console.log('Generating SSL certificates...')
        await run(
            `mkcert -key-file "./.cert/key.pem" -cert-file "./.cert/cert.pem" "${domain}"`
        )

        console.log('Certificates generated successfully.')
    } catch (error) {
        console.error('Error setting up certificates:', error)
    }
}

async function flushDNS() {
    try {
        let command

        if (platform === 'win32') command = 'ipconfig /flushdns' // Windows
        else if (platform === 'darwin')
            command = 'sudo killall -HUP mDNSResponder' // macOS
        else command = 'sudo systemd-resolve --flush-caches' // Linux

        await run(command)

        console.log('DNS cache flushed successfully.')
    } catch (error) {
        console.error('Error flushing DNS:', error.message)
    }
}

function appendDomainToHostsFile() {
    const entry = `${ip} ${domain}`

    const filePath =
        platform === 'win32'
            ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
            : '/etc/hosts'

    const content = fs.readFileSync(filePath, 'utf-8')

    if (content.includes(entry)) {
        console.log('Entry already exists in the hosts file.')
        return
    }

    sudo.exec(
        `echo ${entry} >> ${filePath}`,
        { name: 'Hosts File Modification' },
        (error) => {
            if (error) {
                console.error('Error modifying the hosts file:', error.message)
            } else {
                console.log('Entry added to the hosts file successfully.')
                flushDNS()
            }
        }
    )
}

async function setup() {
    appendDomainToHostsFile()
    await installMkcert()
    await setupCertificates()
}

setup()
