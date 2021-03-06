app.clipboard = {
   store: {},
   selection: {},
   copy: function(area) {
      this.store = app.clone(app.ui.cursor.selected.copy)
   },

   cut: function(area) {
      this.store = this.getCopy(area)
      app.image.clearPixels(area)
   },

   paste: function(x=0, y=0) {
      //this.pasteCopy(x, y, this.store)

      if(app.ui.cursor.selected) {
         this.pasteCopy(
            app.ui.cursor.selected.x,
            app.ui.cursor.selected.y,
            app.ui.cursor.selected.copy)
      }
      var copy = this.store

      var selected = { ...copy.dimensions, copy }
      app.ui.cursor.update({ selected })
   },

   pasteCopy(x, y, copy) {
      //if(!copy || !copy.dimensions) return

      var image = app.frames.getCurrentFrame()
      for(var cx = 0; cx < copy.dimensions.width; cx++) {
         for(var cy = 0; cy < copy.dimensions.height; cy++) {
            var pasteX = cx + x
            var pasteY = cy + y
            copy.pixels[cx][cy].x = pasteX
            copy.pixels[cx][cy].y = pasteY
            if(image.pixels[pasteX] && image.pixels[pasteX][pasteY]) {
               var copyPixel = copy.pixels[cx][cy]
               app.frames.drawPixel(pasteX, pasteY, copyPixel.color)
            }
         }
      }

      app.updateFrame()
   },

   getCopy(area) {
      var copy = {
         dimensions: {
            x: 0,
            y: 0,
            width: area.width,
            height: area.height
         },
         pixels: []
      }

      var image = app.frames.getCurrentFrame()
      for(var x = 0; x < area.width; x++) {
         copy.pixels[x] = []
         for(var y = 0; y < area.height; y++) {
            copy.pixels[x][y] = image.pixels[area.x+x][area.y+y]
         }
      }

      return app.clone(copy)
   }
}
