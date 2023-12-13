import { Elysia } from 'elysia'

const plugin = (app: Elysia) =>
    app.get(
        '/plugin',
        () =>
            new Response(
                JSON.stringify({
                    message: 'Hello Plugin!'
                })
            )
    )

const pluginPrefix = ({ prefix }: { prefix: string }) =>
    new Elysia({ name: 'plugin-prefix', seed: '128jada1271218271' }).get(
        `${prefix}/plugin`,
        () => `Plugin version: ${prefix}`
    )

const userGroup = (app: Elysia) =>
    app.group('/user', (app) => app.get('/test', () => 'User test'))

const app = new Elysia()
    .state('version', '1.0')
    .decorate('getDate', () => Date.now())
    .derive(({ request: { headers } }) => {
        const authHeader = headers.get('auth') || ''

        return {
            auth: `${authHeader} | format`
        }
    })
    .use(plugin)
    .use(pluginPrefix({ prefix: 'v1' }))
    .use(pluginPrefix({ prefix: 'v2' }))
    .use(userGroup)
    .get('/', () => 'Hello Elysia')
    .get('/params/:id', ({ params: { id } }) => `Your ID: ${id}`)
    .get(
        '/version',
        ({ store: { version } }) => `Api service version is: ${version}`
    )
    .get('/auth', ({ auth }) => `Auth Value: ${auth}`)
    .get('/time', ({ getDate }) => `Time now: ${getDate()}`)
    .listen(3000, (server) =>
        console.log(
            `🦊 Elysia is running at ${server?.hostname}:${server?.port}`
        )
    )
