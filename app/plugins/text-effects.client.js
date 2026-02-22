import Splitting from 'splitting'

const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

class Cell {
  constructor(el, { position = -1, previousCellPosition = -1 } = {}) {
    this.DOM = { el }
    this.position = position
    this.previousCellPosition = previousCellPosition
    this.original = el.innerHTML
    this.state = this.original
    this.originalColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text')
    this.color = this.originalColor
    this.cache = undefined
  }

  set(state) {
    this.state = state
    this.DOM.el.innerHTML = state
  }
}

class Line {
  constructor(position) {
    this.position = position
    this.cells = []
  }
}

class TextEffects {
  lettersAndSymbols = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/',
    '[', ']', '{', '}', ';', ':', '<', '>', ',',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ]

  constructor(el) {
    this.DOM = { el }
    this.lines = []
    this.totalChars = 0
    this.isAnimating = false

    const results = Splitting({ target: el, by: 'lines' })
    results.forEach(result => Splitting({ target: result.words }))

    for (const [lineIndex, lineWords] of (results[0].lines ?? []).entries()) {
      const line = new Line(lineIndex)
      let cellIndex = 0
      for (const word of lineWords) {
        for (const charEl of [...word.querySelectorAll('.char')]) {
          line.cells.push(new Cell(charEl, {
            position: cellIndex,
            previousCellPosition: cellIndex === 0 ? -1 : cellIndex - 1,
          }))
          cellIndex++
        }
      }
      this.lines.push(line)
      this.totalChars += cellIndex
    }
  }

  getRandomChar() {
    return this.lettersAndSymbols[Math.floor(Math.random() * this.lettersAndSymbols.length)]
  }

  clearCells() {
    for (const line of this.lines)
      for (const cell of line.cells)
        cell.set('&nbsp;')
  }

  fx1() {
    let completed = 0
    this.clearCells()
    const animate = (line, cell, iteration = 0) => {
      cell.cache = cell.state
      if (iteration === 44) {
        cell.set(cell.original)
        if (++completed === this.totalChars) this.isAnimating = false
      } else if (cell.position === 0) {
        cell.set(
          iteration < 9
            ? ['*', '-', "'", '"'][Math.floor(4 * Math.random())]
            : this.getRandomChar(),
        )
      } else {
        cell.set(line.cells[cell.previousCellPosition]?.cache ?? '&nbsp;')
      }
      if (cell.cache !== '&nbsp;') iteration++
      if (iteration < 45) setTimeout(() => animate(line, cell, iteration), 15)
    }
    for (const line of this.lines)
      for (const cell of line.cells)
        setTimeout(() => animate(line, cell), 200 * (line.position + 1))
  }

  fx2() {
    let completed = 0
    const animate = (line, cell, iteration = 0) => {
      if (iteration === 19) {
        cell.set(cell.original)
        cell.DOM.el.style.opacity = '0'
        setTimeout(() => { cell.DOM.el.style.opacity = '1' }, 300)
        if (++completed === this.totalChars) this.isAnimating = false
      } else {
        cell.set(this.getRandomChar())
      }
      if (++iteration < 20) setTimeout(() => animate(line, cell, iteration), 40)
    }
    for (const line of this.lines)
      for (const cell of line.cells)
        setTimeout(() => animate(line, cell), 30 * (cell.position + 1))
  }

  fx3() {
    let completed = 0
    this.clearCells()
    const animate = (line, cell, iteration = 0) => {
      if (iteration === 9) {
        cell.set(cell.original)
        if (++completed === this.totalChars) this.isAnimating = false
      } else {
        cell.set(this.getRandomChar())
      }
      if (++iteration < 10) setTimeout(() => animate(line, cell, iteration), 80)
    }
    for (const line of this.lines)
      for (const cell of line.cells)
        setTimeout(() => animate(line, cell), randInt(0, 2000))
  }

  fx4() {
    let completed = 0
    this.clearCells()
    const animate = (line, cell, iteration = 0) => {
      cell.cache = cell.state
      if (iteration === 29) {
        cell.set(cell.original)
        if (++completed === this.totalChars) this.isAnimating = false
      } else if (cell.position === 0) {
        cell.set(['*', ':'][Math.floor(2 * Math.random())])
      } else {
        cell.set(line.cells[cell.previousCellPosition]?.cache ?? '&nbsp;')
      }
      if (cell.cache !== '&nbsp;') iteration++
      if (iteration < 30) setTimeout(() => animate(line, cell, iteration), 15)
    }
    for (const line of this.lines)
      for (const cell of line.cells)
        setTimeout(() => animate(line, cell), 400 * Math.abs(this.lines.length / 2 - line.position))
  }

  fx5() {
    let completed = 0
    this.clearCells()
    const animate = (line, cell, iteration = 0) => {
      cell.cache = { state: cell.state, color: cell.color }
      if (iteration === 29) {
        cell.color = cell.originalColor
        cell.DOM.el.style.color = cell.color
        cell.set(cell.original)
        if (++completed === this.totalChars) this.isAnimating = false
      } else if (cell.position === 0) {
        cell.color = ['#3e775d', '#61dca3', '#61b3dc'][Math.floor(3 * Math.random())]
        cell.DOM.el.style.color = cell.color
        cell.set(
          iteration < 9
            ? ['*', '-', "'", '"'][Math.floor(4 * Math.random())]
            : this.getRandomChar(),
        )
      } else {
        const prevCache = line.cells[cell.previousCellPosition]?.cache
        cell.set(prevCache?.state ?? '&nbsp;')
        cell.color = prevCache?.color ?? cell.originalColor
        cell.DOM.el.style.color = cell.color
      }
      if (cell.cache.state !== '&nbsp;') iteration++
      if (iteration < 30) setTimeout(() => animate(line, cell, iteration), 10)
    }
    for (const line of this.lines)
      for (const cell of line.cells)
        setTimeout(() => animate(line, cell), 200 * (line.position + 1))
  }

  fx6() {
    let completed = 0
    const animate = (line, cell, iteration = 0) => {
      cell.cache = { state: cell.state, color: cell.color }
      if (iteration === 14) {
        cell.set(cell.original)
        cell.color = cell.originalColor
        cell.DOM.el.style.color = cell.color
        if (++completed === this.totalChars) this.isAnimating = false
      } else {
        cell.set(this.getRandomChar())
        cell.color = ['#2b4539', '#61dca3', '#61b3dc'][Math.floor(3 * Math.random())]
        cell.DOM.el.style.color = cell.color
      }
      if (++iteration < 15) setTimeout(() => animate(line, cell, iteration), randInt(30, 110))
    }
    for (const line of this.lines)
      for (const cell of line.cells)
        setTimeout(() => animate(line, cell), 80 * (line.position + 1))
  }

  trigger(fxName) {
    const effects = {
      fx1: () => this.fx1(),
      fx2: () => this.fx2(),
      fx3: () => this.fx3(),
      fx4: () => this.fx4(),
      fx5: () => this.fx5(),
      fx6: () => this.fx6(),
    }
    if (fxName in effects && !this.isAnimating) {
      this.isAnimating = true
      effects[fxName]()
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    document.body.classList.add('loading')

    document.fonts.ready.then(() => {
      document.body.classList.remove('loading')

      const content = document.querySelector('.content')
      if (!content) return

      const effects = new TextEffects(content)
      effects.trigger('fx6')

      document.querySelectorAll('.effects > button').forEach((btn) => {
        btn.addEventListener('click', () => {
          effects.trigger(`fx${btn.dataset.fx}`)
        })
      })
    })
  })
})
