package services

import play.api.mvc._
import javax.inject._
import play.api.libs.json._
import scala.collection.mutable.ListBuffer
import models.Product

@Singleton
class ProductService {
  private val products = ListBuffer(
    Product(1, "Gibson SG", 5000.0),
    Product(2, "Mesa Boogie", 7200.0)
  )

  def getAll: List[Product] = products.toList
  def getById(id: Int): Option[Product] = products.find(_.id == id)
  def add(product: Product): Product = { products += product; product }
  def update(id: Int, updatedProduct: Product): Option[Product] = {
    products.indexWhere(_.id == id) match {
      case -1 =>  None
      case index =>
        products.update(index, updatedProduct)
        Some(updatedProduct)
    }
  }
  def delete(id: Int): Boolean = {
    products.indexWhere(_.id == id) match {
      case -1 => false
      case index =>
        products.remove(index)
        true
    }
  }
}
