app.tools.draw = {
   select() {
      app.ui.cursor.update({ fill: true, selected: false, mode: 'stroke' })
   },

   down(mouse) {
      this.temp(mouse.positions)
   },

   up(mouse) {
      app.history.push()
      this.draw(mouse.positions)
   },

   move(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
   },

   stroke(mouse) {
      app.ui.cursor.update(mouse.positionCurrent)
      this.temp(mouse.positions)
   },

   temp(positions) {
      var pixels = this.pixelsBetweenPositions(positions)
      app.ui.canvas.temporaryPixels(pixels)
   },

   draw(positions) {
      var pixels = this.pixelsBetweenPositions(positions)
      app.image.drawPixels(pixels)
   },

   pixelsBetweenPositions(positions) {
      var size = app.ui.cursor.size
      var pixels = []
      var lastPos = positions[0]
      for(var position of positions) {
         pixels.push(...app.magic.pixelsBetweenPoints(lastPos, position, size))
         lastPos = position
      }

      return app.magic.removeCollidingPixels(pixels)
   }
}
