'use strict';

//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })

//Activating Modal-testimonial

const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
}

for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener('click', function () {
        modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
        modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
        modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
        modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

        testimonialsModalFunc();
    })
}

//Activating close button in modal-testimonial

modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {elementToggleFunc(this); });

for(let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for(let i = 0; i < filterItems.length; i++) {
        if(selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}

//Enabling filter button for larger screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
    
    filterBtn[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for(let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if(form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else { 
            formBtn.setAttribute('disabled', '');
        }
    })
}

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for(let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function() {
        
        for(let i = 0; i < pages.length; i++) {
            if(this.innerHTML.toLowerCase() == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i]. classList.remove('active');
            }
        }
    });
}

#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define N normalize
#define S smoothstep
#define MN min(R.x,R.y)
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
#define csqr(a) vec2(a.x*a.x-a.y*a.y,2.*a.x*a.y)
float rnd(vec3 p) {
	p=fract(p*vec3(12.9898,78.233,156.34));
	p+=dot(p,p+34.56);
	return fract(p.x*p.y*p.z);
}
float swirls(in vec3 p) {
	float d=.0;
	vec3 c=p;
	for(float i=min(.0,time); i<9.; i++) {
		p=.7*abs(p)/dot(p,p)-.7;
		p.yz=csqr(p.yz);
		p=p.zxy;
		d+=exp(-19.*abs(dot(p,c)));
	}
	return d;
}
vec3 march(in vec3 p, vec3 rd) {
	float d=.2, t=.0, c=.0, k=mix(.9,1.,rnd(rd)),
	maxd=length(p)-1.;
	vec3 col=vec3(0);
	for(float i=min(.0,time); i<120.; i++) {
		t+=d*exp(-2.*c)*k;
		c=swirls(p+rd*t);
		if (t<5e-2 || t>maxd) break;
		col+=vec3(c*c,c/1.05,c)*8e-3;
	}
	return col;
}
float rnd(vec2 p) {
	p=fract(p*vec2(12.9898,78.233));
	p+=dot(p,p+34.56);
	return fract(p.x*p.y);
}
vec3 sky(vec2 p, bool anim) {
	p.x-=.17-(anim?2e-4*T:.0);
	p*=500.;
	vec2 id=floor(p), gv=fract(p)-.5;
	float n=rnd(id), d=length(gv);
	if (n<.975) return vec3(0);
	return vec3(S(3e-2*n,1e-3*n,d*d));
}
void cam(inout vec3 p) {
	p.yz*=rot(move.y*6.3/MN-T*.05);
	p.xz*=rot(-move.x*6.3/MN+T*.025);
}
void main() {
	vec2 uv=(FC-.5*R)/MN;
	vec3 col=vec3(0),
	p=vec3(0,0,-16),
	rd=N(vec3(uv,1)), rdd=rd;
	cam(p); cam(rd);
	col=march(p,rd);
	col=S(-.2,.9,col);
	vec2 sn=.5+vec2(atan(rdd.x,rdd.z),atan(length(rdd.xz),rdd.y))/6.28318;
	col=max(col,vec3(sky(sn,true)+sky(2.+sn*2.,true)));
	float t=min((time-.5)*.3,1.);
	uv=FC/R*2.-1.;
	uv*=.7;
	float v=pow(dot(uv,uv),1.8);
	col=mix(col,vec3(0),v);
	col=mix(vec3(0),col,t);
	col=max(col,.08);
  O=vec4(col,1);
}


/*********
 * made by Matthias Hurrle (@atzedent)
 */
let editMode = false // set to false to hide the code editor on load
let resolution = .5 // set 1 for full resolution or to .5 to start with half resolution on load
let renderDelay = 1000 // delay in ms before rendering the shader after a change
let dpr = Math.max(1, resolution * window.devicePixelRatio)
let frm, source, editor, store, renderer, pointers
const shaderId = 'oggKrGW'
window.onload = init

function resize() {
  const { innerWidth: width, innerHeight: height } = window

  canvas.width = width * dpr
  canvas.height = height * dpr

  if (renderer) {
    renderer.updateScale(dpr)
  }
}
function toggleView() {
  editor.hidden = btnToggleView.checked
  canvas.style.setProperty('--canvas-z-index', btnToggleView.checked ? 0 : -1)
}
function reset() {
  let shader = source
  editor.text = shader ? shader.textContent : renderer.defaultSource
  store.putShaderSource(shaderId, editor.text)
  renderThis()
}
function toggleResolution() {
  resolution = btnToggleResolution.checked ? .5 : 1
  dpr = Math.max(1, resolution * window.devicePixelRatio)
  pointers.updateScale(dpr)
  resize()
}
function loop(now) {
  renderer.updateMouse(pointers.first)
  renderer.updatePointerCount(pointers.count)
  renderer.updatePointerCoords(pointers.coords)
  renderer.updateMove(pointers.move)
  renderer.render(now)
  frm = requestAnimationFrame(loop)
}
function renderThis() {
  editor.clearError()
  store.putShaderSource(shaderId, editor.text)

  const result = renderer.test(editor.text)

  if (result) {
    editor.setError(result)
  } else {
    renderer.updateShader(editor.text)
  }
  cancelAnimationFrame(frm) // Always cancel the previous frame!
  loop(0)
}
const debounce = (fn, delay) => {
  let timerId
  return (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => fn.apply(this, args), delay)
  }
}
const render = debounce(renderThis, renderDelay)
function init() {
  source = document.querySelector("script[type='x-shader/x-fragment']")

  document.title = "Sketchy, But Keeps Spinning"

  renderer = new Renderer(canvas, dpr)
  pointers = new PointerHandler(canvas, dpr)
  store    = new Store(window.location)
  editor   = new Editor(codeEditor, error, indicator)
  editor.text = source.textContent
  renderer.setup()
  renderer.init()

  if (!editMode) {
    btnToggleView.checked = true
    toggleView()
  }
  if (resolution === .5) {
    btnToggleResolution.checked = true
    toggleResolution()
  }
  canvas.addEventListener('shader-error', e => editor.setError(e.detail))

  resize()

  if (renderer.test(source.textContent) === null) {
    renderer.updateShader(source.textContent)
  }
  loop(0)
  window.onresize = resize
  window.addEventListener("keydown", e => {
    if (e.key === "L" && e.ctrlKey) {
      e.preventDefault()
      btnToggleView.checked = !btnToggleView.checked
      toggleView()
    }
  })
}
class Renderer {
  #vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}"
  #fragmtSrc = "#version 300 es\nprecision highp float;\nout vec4 O;\nuniform float time;\nuniform vec2 resolution;\nvoid main() {\n\tvec2 uv=gl_FragCoord.xy/resolution;\n\tO=vec4(uv,sin(time)*.5+.5,1);\n}"
  #vertices = [-1, 1, -1, -1, 1, 1, 1, -1]
  constructor(canvas, scale) {
    this.canvas = canvas
    this.scale = scale
    this.gl = canvas.getContext("webgl2")
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale)
    this.shaderSource = this.#fragmtSrc
    this.mouseMove = [0, 0]
    this.mouseCoords = [0, 0]
    this.pointerCoords = [0, 0]
    this.nbrOfPointers = 0
  }
  get defaultSource() { return this.#fragmtSrc }
  updateShader(source) {
    this.reset()
    this.shaderSource = source
    this.setup()
    this.init()
  }
  updateMove(deltas) {
    this.mouseMove = deltas
  }
  updateMouse(coords) {
    this.mouseCoords = coords
  }
  updatePointerCoords(coords) {
    this.pointerCoords = coords
  }
  updatePointerCount(nbr) {
    this.nbrOfPointers = nbr
  }
  updateScale(scale) {
    this.scale = scale
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale)
  }
  compile(shader, source) {
    const gl = this.gl
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
      this.canvas.dispatchEvent(new CustomEvent('shader-error', { detail: gl.getShaderInfoLog(shader) }))
    }
  }
  test(source) {
    let result = null
    const gl = this.gl
    const shader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader)
    }
    if (gl.getShaderParameter(shader, gl.DELETE_STATUS)) {
      gl.deleteShader(shader)
    }
    return result
  }
  reset() {
    const { gl, program, vs, fs } = this
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return
    if (gl.getShaderParameter(vs, gl.DELETE_STATUS)) {
      gl.detachShader(program, vs)
      gl.deleteShader(vs)
    }
    if (gl.getShaderParameter(fs, gl.DELETE_STATUS)) {
      gl.detachShader(program, fs)
      gl.deleteShader(fs)
    }
    gl.deleteProgram(program)
  }
  setup() {
    const gl = this.gl
    this.vs = gl.createShader(gl.VERTEX_SHADER)
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)
    this.compile(this.vs, this.#vertexSrc)
    this.compile(this.fs, this.shaderSource)
    this.program = gl.createProgram()
    gl.attachShader(this.program, this.vs)
    gl.attachShader(this.program, this.fs)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program))
    }
  }
  init() {
    const { gl, program } = this
    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, "position")

    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    program.resolution = gl.getUniformLocation(program, "resolution")
    program.time = gl.getUniformLocation(program, "time")
    program.move = gl.getUniformLocation(program, "move")
    program.touch = gl.getUniformLocation(program, "touch")
    program.pointerCount = gl.getUniformLocation(program, "pointerCount")
    program.pointers = gl.getUniformLocation(program, "pointers")
  }
  render(now = 0) {
    const { gl, program, buffer, canvas, mouseMove, mouseCoords, pointerCoords, nbrOfPointers } = this
    
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.uniform2f(program.resolution, canvas.width, canvas.height)
    gl.uniform1f(program.time, now * 1e-3)
    gl.uniform2f(program.move, ...mouseMove)
    gl.uniform2f(program.touch, ...mouseCoords)
    gl.uniform1i(program.pointerCount, nbrOfPointers)
    gl.uniform2fv(program.pointers, pointerCoords)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}
class Store {
  constructor(key) {
    this.key = key
    this.store = window.localStorage
  }
  #ownShadersKey = 'ownShaders'
  #StorageType = Object.freeze({
    shader: 'fragmentSource',
    config: 'config'
  })
  #getKeyPrefix(type) {
    return `${type}${btoa(this.key)}`
  }
  #getKey(type, name) {
    return `${this.#getKeyPrefix(type)}${btoa(name)}`
  }
  putShaderSource(name, source) {
    const storageType = this.#StorageType.shader
    this.store.setItem(this.#getKey(storageType, name), source)
  }
  getShaderSource(name) {
    const storageType = this.#StorageType.shader
    return this.store.getItem(this.#getKey(storageType, name))
  }
  deleteShaderSource(name) {
    const storageType = this.#StorageType.shader
    this.store.removeItem(this.#getKey(storageType, name))
  }
  /** @returns {{title:string, uuid:string}[]} */
  getOwnShaders() {
    const storageType = this.#StorageType.config
    const result = this.store.getItem(this.#getKey(storageType, this.#ownShadersKey))
    
    return result ? JSON.parse(result) : []
  }
  /** @param {{title:string, uuid:string}[]} shader */
  putOwnShader(shader) {
    const ownShaders = this.getOwnShaders()
    const storageType = this.#StorageType.config
    const index = ownShaders.findIndex((s) => s.uuid === shader.uuid)
    if (index === -1) {
      ownShaders.push(shader)
    } else {
      ownShaders[index] = shader
    }
    this.store.setItem(this.#getKey(storageType, this.#ownShadersKey), JSON.stringify(ownShaders))
  }
  deleteOwnShader(uuid) {
    const ownShaders = this.getOwnShaders()
    const storageType = this.#StorageType.config
    this.store.setItem(this.#getKey(storageType, this.#ownShadersKey), JSON.stringify(ownShaders.filter((s) => s.uuid !== uuid) ))
    this.deleteShaderSource(uuid)
  }
  /** @param {string[]} keep The names of the shaders to keep*/
  cleanup(keep=[]) {
    const storageType = this.#StorageType.shader
    const ownShaders = this.getOwnShaders().map((s) => this.#getKey(storageType, s.uuid))
    const premadeShaders = keep.map((name) => this.#getKey(storageType, name))
    const keysToKeep = [...ownShaders, ...premadeShaders]
    const result = []

    for (let i = 0; i < this.store.length; i++) {
      const key = this.store.key(i)

      if (key.startsWith(this.#getKeyPrefix(this.#StorageType.shader)) && !keysToKeep.includes(key)) {
        result.push(key)
      }
    }

    result.forEach((key) => this.store.removeItem(key))
  }
}
class PointerHandler {
  constructor(element, scale) {
    this.scale = scale
    this.active = false
    this.pointers = new Map()
    this.lastCoords = [0,0]
    this.moves = [0,0]
    const map = (element, scale, x, y) => [x * scale, element.height - y * scale]
    element.addEventListener("pointerdown", (e) => {
      this.active = true
      this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY))
    })
    element.addEventListener("pointerup", (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first
      }
      this.pointers.delete(e.pointerId)
      this.active = this.pointers.size > 0
    })
    element.addEventListener("pointerleave", (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first
      }
      this.pointers.delete(e.pointerId)
      this.active = this.pointers.size > 0
    })
    element.addEventListener("pointermove", (e) => {
      if (!this.active) return
      this.lastCoords = [e.clientX, e.clientY]
      this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY))
      this.moves = [this.moves[0]+e.movementX, this.moves[1]+e.movementY]
    })
  }
  getScale() {
    return this.scale
  }
  updateScale(scale) { this.scale = scale }
  reset() {
    this.pointers.clear()
    this.active = false
    this.moves = [0,0]
  }
  get count() {
    return this.pointers.size
  }
  get move() {
    return this.moves
  }
  get coords() {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).map((p) => [...p]).flat() : [0, 0]
  }
  get first() {
    return this.pointers.values().next().value || this.lastCoords
  }
}
class Editor {
  constructor(textarea, errorfield, errorindicator) {
    this.textarea = textarea
    this.errorfield = errorfield
    this.errorindicator = errorindicator
    textarea.addEventListener('keydown', this.handleKeydown.bind(this))
    textarea.addEventListener('scroll', this.handleScroll.bind(this))
  }
  get hidden() { return this.textarea.classList.contains('hidden') }
  set hidden(value) { value ? this.#hide() : this.#show() }
  get text() { return this.textarea.value }
  set text(value) { this.textarea.value = value }
  get scrollTop() { return this.textarea.scrollTop }
  set scrollTop(value) { this.textarea.scrollTop = value }
  setError(message) {
    this.errorfield.innerHTML = message
    this.errorfield.classList.add('opaque')
    const match = message.match(/ERROR: \d+:(\d+):/)
    const lineNumber = match ? parseInt(match[1]) : 0
    const overlay = document.createElement('pre')

    overlay.classList.add('overlay')
    overlay.textContent = '\n'.repeat(lineNumber)

    document.body.appendChild(overlay)

    const offsetTop = parseInt(getComputedStyle(overlay).height)

    this.errorindicator.style.setProperty('--top', offsetTop + 'px')
    this.errorindicator.style.visibility = 'visible'

    document.body.removeChild(overlay)
  }
  clearError() {
    this.errorfield.textContent = ''
    this.errorfield.classList.remove('opaque')
    this.errorfield.blur()
    this.errorindicator.style.visibility = 'hidden'
  }
  focus() {
    this.textarea.focus()
  }
  #hide() {
    for (const el of [this.errorindicator, this.errorfield, this.textarea]) {
      el.classList.add('hidden')
    }
  }
  #show() {
    for (const el of [this.errorindicator, this.errorfield, this.textarea]) {
      el.classList.remove('hidden')
    }
    this.focus()
  }
  handleScroll() {
    this.errorindicator.style.setProperty('--scroll-top', `${this.textarea.scrollTop}px`)
  }
  handleKeydown(event) {
    if (event.key === "Tab") {
      event.preventDefault()
      this.handleTabKey(event.shiftKey)
    } else if (event.key === "Enter") {
      event.preventDefault()
      this.handleEnterKey()
    }
  }
  handleTabKey(shiftPressed) {
    if (this.#getSelectedText() !== "") {
      if (shiftPressed) {
        this.#unindentSelectedText()
        return
      }
      this.#indentSelectedText()
    } else {
      this.#indentAtCursor()
    }
  }
  #getSelectedText() {
    const editor = this.textarea
    const start = editor.selectionStart
    const end = editor.selectionEnd
    return editor.value.substring(start, end)
  }
  #indentAtCursor() {
    const editor = this.textarea
    const cursorPos = editor.selectionStart

    document.execCommand('insertText', false, '\t')
    editor.selectionStart = editor.selectionEnd = cursorPos + 1
  }
  #indentSelectedText() {
    const editor = this.textarea
    const cursorPos = editor.selectionStart
    const selectedText = this.#getSelectedText()
    const lines = selectedText.split('\n')
    const indentedText = lines.map(line => '\t' + line).join('\n')

    document.execCommand('insertText', false, indentedText)
    editor.selectionStart = cursorPos
  }
  #unindentSelectedText() {
    const editor = this.textarea
    const cursorPos = editor.selectionStart
    const selectedText = this.#getSelectedText()
    const lines = selectedText.split('\n')
    const indentedText = lines.map(line => line.replace(/^\t/, '').replace(/^ /, '')).join('\n')

    document.execCommand('insertText', false, indentedText)
    editor.selectionStart = cursorPos
  }
  handleEnterKey() {
    const editor = this.textarea
    const visibleTop = editor.scrollTop
    const cursorPosition = editor.selectionStart

    let start = cursorPosition - 1
    while (start >= 0 && editor.value[start] !== '\n') {
      start--
    }

    let newLine = ''
    while (start < cursorPosition - 1 && (editor.value[start + 1] === ' ' || editor.value[start + 1] === '\t')) {
      newLine += editor.value[start + 1]
      start++
    }

    document.execCommand('insertText', false, '\n' + newLine)
    editor.selectionStart = editor.selectionEnd = cursorPosition + 1 + newLine.length
    editor.scrollTop = visibleTop // Prevent the editor from scrolling
    const lineHeight = editor.scrollHeight / editor.value.split('\n').length
    const line = editor.value.substring(0, cursorPosition).split('\n').length

    // Do the actual layout calculation in order to get the correct scroll position
    const visibleBottom = editor.scrollTop + editor.clientHeight
    const lineTop = lineHeight * (line - 1)
    const lineBottom = lineHeight * (line + 2)

    // If the cursor is outside the visible range, scroll the editor
    if (lineTop < visibleTop) editor.scrollTop = lineTop
    if (lineBottom > visibleBottom) editor.scrollTop = lineBottom - editor.clientHeight
  }
}