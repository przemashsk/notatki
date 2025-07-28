import ftpDeploy from 'ftp-deploy'
import path from 'path'

const config = {
    user: 'marketingwiked@cloudserver2082088.home.pl',
    password: 'Obrazwik321', // najlepiej z .env
    host: 'cloudserver2082088.home.pl',
    port: 21,
    localRoot: path.resolve('./dist'),
    remoteRoot: '/public_html/pbarthelke/',
    include: ['*', '**/*'],
    deleteRemote: true,
    forcePasv: true,
}

// ftpDeploy to teraz funkcja, nie obiekt!
ftpDeploy(config)
    .then(res => console.log('✅ Zakończono deploy!', res))
    .catch(err => console.error('❌ Błąd deployu:', err))
