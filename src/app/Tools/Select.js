app.tools.select = {
   select() {
      app.global.color = 'rgba(0, 0, 0, 0)'
      app.script.setCursor({ selected: undefined, fill: false })
   },

   move(mouse) {
      app.script.setCursor({
         x: mouse.positionCurrent.x,
         y: mouse.positionCurrent.y
      })
   },

   down(mouse) {
      if(mouse.dragging) {
         // just copy this beast
         var selected = app.component.cursor.selected
         this.moving = app.utility.copyArea(selected)

         return
      }

      app.script.setCursor({
         selected: {
            x: mouse.positionStart.x,
            y: mouse.positionStart.y,
            width: 1,
            height: 1
         }
      })
   },

   stroke(mouse) {
      if(mouse.dragging) {
         console.log('select tool: dragging')
         var notFirstMove = mouse.positionTotalDelta.x != mouse.positionDelta.x
            || mouse.positionTotalDelta.y != mouse.positionDelta.y

         if(notFirstMove) {
            console.log('revert then move total')
            app.history.undo()
         }

         app.history.push()

         var selected = app.component.cursor.selected
         app.utility.moveArea(selected, mouse.positionTotalDelta)

         return
      }

      app.script.setCursor({
         selected: this.getSelected(mouse)
      })
   },

   up(mouse) {
      if(mouse.dragging) {

         return
      }

      if(this.mouseDidNotMove(mouse)) {
         return app.script.setCursor({ selected: undefined })
      }

      app.script.setCursor({
         selected: this.getSelected(mouse)
      })
   },

   getSelected(mouse) {
      var moved = this.getMouseMoved(mouse)
      var x = mouse.positionStart.x
      var y = mouse.positionStart.y
      var width = Math.abs(moved.width) + 1
      var height = Math.abs(moved.height) + 1

      if(moved.width < 0) x += moved.width
      if(moved.height < 0) y += moved.height

      return { x, y, width, height }
   },

   mouseDidNotMove(mouse) {
      var moved = this.getMouseMoved(mouse)
      return (!moved.width && !moved.height)
   },

   getMouseMoved(mouse) {
      return {
         width: mouse.positionCurrent.x - mouse.positionStart.x,
         height: mouse.positionCurrent.y - mouse.positionStart.y
      }
   }
}
