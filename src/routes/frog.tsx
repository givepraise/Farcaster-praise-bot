import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import routes from "./routes.js";

export const frogApp = new Frog({
    // Supply a Hub to enable frame verification.
    // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
    basePath: routes.frog,
    title: 'Praise in Farcaster',
})

frogApp.frame('/', (c) => {
    const { buttonValue, status } = c
    return c.res({
        image: (
            <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
                {status === 'initial' ? (
                    'Select your fruit!'
                ) : (
                    `Selected: ${buttonValue}`
                )}
            </div>
        ),
        intents: [
            <Button value="apple">Apple</Button>,
            <Button value="banana">Banana</Button>,
            <Button value="mango">Mango</Button>
        ]
    })
})

frogApp.use('/*', serveStatic({ root: './public' }))
devtools(frogApp, { serveStatic })
