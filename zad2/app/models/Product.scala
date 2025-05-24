package models

import play.api.mvc._
import javax.inject._
import play.api.libs.json._
import scala.collection.mutable.ListBuffer

case class Product(id: Int, name: String, price: Double)
object Product {
  implicit val productFormat: OFormat[Product] = Json.format[Product]
}
