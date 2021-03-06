app.initializeUI = function() {
   app.ui = {}

   app.ui.layout = new Layout(document.body)

   app.ui.menu = new Menu({
      menu: app.config.menu,
      onClick: (label) => {
         app.ui.menu.navigate('home')
         app.ui.menu.toggle()
         app.command[label] && app.command[label]()
      }
   })

   app.ui.appbar = new Appbar({
      onOpen: () => {
         app.ui.menu.toggle()
      }
   })

   app.ui.statusbar = new Statusbar({
      status: {
         color: '[ hsla() ]',
         pos: '[ pos: 0, 0 ]',
         scale: '[ scale: 1x ]',
      }
   })

   app.ui.toolbox = new Toolbox({
      initialTool: 'line',
      tools: [
         { name: 'select', icon: 'select', overrides : app.tools.select, hint: 'shortcut: s' },
         { name: 'draw', icon: 'draw', overrides : app.tools.draw, hint: 'shortcut: d' },
         { name: 'line', icon: 'line', overrides : app.tools.line, hint: 'shortcut: l' },
         { name: 'rectangle', icon: 'rectangle', overrides : app.tools.rectangle, hint: 'shortcut: r' },
         { name: 'fill', icon: 'fill', overrides : app.tools.fill, hint: 'shortcut: f'  },
         { name: 'eraser', icon: 'eraser', overrides : app.tools.eraser, hint: 'shortcut: e'  },
         { name: 'read', icon: 'read', overrides : app.tools.read, hint: 'shortcut: i'  },
      ],
   })

   app.ui.cursor = new Cursor({
      onDown: (mouse) => { app.ui.toolbox.down(mouse) },
      onUp: (mouse) => { app.ui.toolbox.up(mouse) },
      onStroke: (mouse) => { app.ui.toolbox.stroke(mouse) },
      onMove: (mouse) => {
         app.ui.toolbox.move(mouse)
         app.ui.statusbar.updateStatus({
            pos: `[ pos: ${mouse.positionCurrent.x}, ${mouse.positionCurrent.y} ]`
         })
      }
   })

   app.ui.canvas = new Canvas()

   app.ui.easel = new Easel({
      center: [
         app.ui.canvas,
         app.ui.cursor
      ],
      onScale: (scale) => {
         app.ui.statusbar.updateStatus({
            scale: `[ scale: ${scale}x ]`
         })
      }
   })

   app.ui.colorMixer = new ColorMixer()
   app.ui.pallet = new Pallet({
      mixer: app.ui.colorMixer,
      onChangeColor: (color) => {
         var colorString = app.frames.hslaToString(color)
         app.ui.statusbar.updateStatus({ color: `[ color: ${colorString} ]` })
         app.ui.cursor.update({ color: colorString })
      },
      onChangeSize: (size) => {
         app.ui.cursor.update({ size })
      }
   })

   app.ui.frames = new Frames({
      frames: app.frames,
      addFrame: () => {
         app.tools.select.unsetSelected()
         app.frames.addFrame()
         app.frames.currentFrame = app.frames.list.length - 1
         app.updateFrame()
         app.history.push()
      },
      selectFrame: (clickedFrameID) => {
         app.tools.select.unsetSelected()
         app.frames.currentFrame = clickedFrameID
         app.updateFrame()
      },
      deleteFrame: (deleteFrameID) => {
         app.tools.select.unsetSelected()
         app.frames.deleteFrame(deleteFrameID)
         app.updateFrame()
         app.history.push()
      }
   })

   app.ui.preview = new Preview()

   app.ui.layout.appendUI(app.ui.menu.bakedHTML, 'sidebar')
   app.ui.layout.appendUI(app.ui.appbar.bakedHTML, 'top')
   app.ui.layout.appendUI(app.ui.statusbar.bakedHTML, 'bottom')
   app.ui.layout.appendUI(app.ui.toolbox.bakedHTML, 'workspace_dockright')
   app.ui.layout.appendUI(app.ui.frames.bakedHTML, 'workspace_docktop')
   app.ui.layout.appendUI(app.ui.pallet.bakedHTML, 'workspace_dockleft')
   app.ui.layout.appendUI(app.ui.easel.bakedHTML, 'workspace_dockbottom')
   app.ui.layout.appendUI(app.ui.preview.bakedHTML, 'workspace_dockbottom')

   // app.ui.dialogNew = new Dialog(app.dialogs.New)
   // app.ui.layout.appendUI(app.ui.dialogNew.bakedHTML, 'menu')
   // you are really lazy :]
   for(var dialogName in app.dialogs) {
      app.ui['dialog'+dialogName] = new Dialog(app.dialogs[dialogName])
      app.ui.layout.appendUI(app.ui['dialog'+dialogName].bakedHTML, 'top')
   }

   // append to body
   app.ui.layout.bakedHTML.appendTo(document.body)
}
