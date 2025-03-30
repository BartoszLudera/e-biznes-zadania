package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import scala.collection.mutable.ListBuffer

case class Product(id: Int, name: String, price: Double)

object Product {
  implicit val productFormat: OFormat[Product] = Json.format[Product]
}

@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val products = ListBuffer(
    Product(1, "Laptop", 3500.0),
    Product(2, "Smartphone", 1500.0),
    Product(3, "Tablet", 1200.0)
  )

  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(products))
  }

  def getById(id: Int): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(Json.obj("error" -> "Product not found"))
    }
  }

  def add: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { product =>
      if (products.exists(_.id == product.id)) {
        Conflict(Json.obj("error" -> "Product with this ID already exists"))
      } else {
        products += product
        Created(Json.toJson(product))
      }
    }.recoverTotal { _ =>
      BadRequest(Json.obj("error" -> "Invalid JSON"))
    }
  }

  def update(id: Int): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { updatedProduct =>
      products.indexWhere(_.id == id) match {
        case -1 => NotFound(Json.obj("error" -> "Product not found"))
        case idx =>
          products.update(idx, updatedProduct)
          Ok(Json.toJson(updatedProduct))
      }
    }.recoverTotal { _ =>
      BadRequest(Json.obj("error" -> "Invalid JSON"))
    }
  }

  def delete(id: Int): Action[AnyContent] = Action {
    products.indexWhere(_.id == id) match {
      case -1 => NotFound(Json.obj("error" -> "Product not found"))
      case idx =>
        products.remove(idx)
        NoContent
    }
  }
}
