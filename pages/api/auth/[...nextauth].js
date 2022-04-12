import NextAuth from "next-auth"
import TwitchProvider from "next-auth/providers/twitch"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        TwitchProvider({
            clientId: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            wellKnown: "https://id.twitch.tv/oauth2/.well-known/openid-configuration",
            authorization: {
                url: "https://id.twitch.tv/oauth2/.well-known/openid-configuration",
                params: {
                    scope: "openid user:read:email clips:edit",
                },
            },
            redirectUri: 'https://id.twitch.tv/oauth2/.well-known/openid-configuration',
        }),
        // ...add more providers here
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            return session
        }
    }
})