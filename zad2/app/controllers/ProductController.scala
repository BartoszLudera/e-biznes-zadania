package controllers

import play.api.mvc._
import javax.inject._
import play.api.libs.json._
import scala.collection.mutable.ListBuffer
import services.ProductService
import models.Product


@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents, productService: ProductService) extends BaseController {
  def getAll = Action {
    Ok(Json.toJson(productService.getAll))
  }

  def getById(id: Int) = Action {
    productService.getById(id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound("Product not found")
    }
  }

def add: Action[JsValue] = Action(parse.json) { request =>
  request.body.validate[Product].map { product =>
      Created(Json.toJson(productService.add(product)))
    }.getOrElse(BadRequest("Invalid JSON"))
}
 def update(id: Int): Action[JsValue] = Action(parse.json) { request =>
  request.body.validate[Product].map { updatedProduct =>
      productService.update(id, updatedProduct) match {
        case Some(product) => Ok(Json.toJson(product))
        case None => NotFound("Product not found")
      }
    }.getOrElse(BadRequest("Invalid JSON"))
}

  def delete(id: Int) = Action {
    if (productService.delete(id)) NoContent
    else NotFound("Product not found")
  }
}
