package b4.controller

import b4.repository.HistoryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.{HttpStatus, ResponseEntity}
import org.springframework.web.bind.annotation.{RequestBody, RequestMapping, RequestMethod, RestController}

import scala.math.{pow, sqrt}
import scala.beans.BeanProperty

case class GraphRequest(@BeanProperty x: Double, @BeanProperty y: Double, @BeanProperty r: Double)

@RestController
@RequestMapping(Array("/graph"))
class GraphController {
  @Autowired
  var historyRepository: HistoryRepository = _

  @RequestMapping(value = Array("/check"), method = Array(RequestMethod.POST))
  def check(@RequestBody request: GraphRequest): ResponseEntity[Boolean] =
    request match {
      case GraphRequest(x, y, r) => new ResponseEntity[Boolean](areaCheck(x, y, r), HttpStatus.OK)
      case _ => new ResponseEntity[Boolean](false, HttpStatus.BAD_REQUEST)
    }

  def areaCheck(x: Double, y: Double, r: Double): Boolean = 
    if (x < 0 && y < 0)           sqrt(pow(x, 2) + pow(y, 2)) <= r
    else if (x <= 0 && y >= 0)    -x <= r && y <= r/2
    else if (x >= 0 && y > 0)     x <= (r/2 - y)
    else false
}
