import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*


fun main() {
    val botToken = "token id"
    val channelId = "<discord channel id>"
    val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json()
        }
    }

    val discordClient = DiscordClient(httpClient, botToken, channelId)

    embeddedServer(Netty, port = 8080) {
        routing {
            post("/message") {
                try {
                    discordClient.sendMessage(call.receiveText())
                    call.respondText("Message sent to Discord successfully.", ContentType.Text.Plain)
                } catch (e: Exception) {
                    call.respondText(
                        "Failed to send message: ${e.localizedMessage}",
                        ContentType.Text.Plain,
                        HttpStatusCode.InternalServerError
                    )
                }
            }
        }
    }.start(wait = true)
}