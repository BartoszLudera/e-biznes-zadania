import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*


class DiscordClient(
    private val httpClient: HttpClient,
    private val botToken: String,
    private val channelId: String
) {
    private val endpoint = "https://discord.com/api/v10/channels/$channelId/messages"

    suspend fun sendMessage(content: String) {
        try {
            val response: HttpResponse = httpClient.post(endpoint) {
                headers {
                    append(HttpHeaders.Authorization, "Bot $botToken")
                    append(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                }
                setBody(content)
            }
            if (response.status.isSuccess()) {
                println("Message sent successfully.")
            } else {
                println("Discord API responded with status ${response.status}")
                println("Response: ${response.bodyAsText()}")
            }
        } catch (e: Exception) {
            println("Failed to send message: ${e.message}")
        }
    }
}