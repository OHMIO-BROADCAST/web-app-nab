import ReactDOM from "react-dom"
import React, { Suspense, useEffect, useRef, useMemo } from "react"
import { Canvas, Dom, useLoader, useFrame } from "react-three-fiber"
import { TextureLoader, LinearFilter } from "three"
import lerp from "lerp"
import { Text, MultilineText } from "./components/Text"
import Diamonds from "./diamonds/Diamonds"
import Plane from "./components/Plane"
import { Block, useBlock } from "./blocks"
import state from "./store"
import "./styles.css"

function Startup() {
  const ref = useRef()
  useFrame(() => (ref.current.material.opacity = lerp(ref.current.material.opacity, 0, 0.025)))
  return <Plane ref={ref} color="#0e0e0f" position={[0, 0, 200]} scale={[100, 100, 1]} />
}

function Paragraph({ image, index, offset, factor, header, aspect, text }) {
  const { contentMaxWidth: w, canvasWidth, margin, mobile } = useBlock()
  const size = aspect < 1 && !mobile ? 0.65 : 1
  const alignRight = (canvasWidth - w * size - margin) / 2
  const pixelWidth = w * state.zoom * size
  const left = !(index % 2)
  const color = index % 2 ? "#D40749" : "#2FE8C3"
  return (
    <Block factor={factor} offset={offset}>
      <group position={[left ? -alignRight : alignRight, 0, 0]}>
        <Plane map={image} args={[1, 1, 32, 32]} shift={75} size={size} aspect={aspect} scale={[w * size, (w * size) / aspect, 1]} frustumCulled={false} />
        <Dom
          style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: left ? "left" : "right" }}
          position={[left || mobile ? (-w * size) / 2 : 0, (-w * size) / 2 / aspect - 0.4, 1]}>
          <div tabIndex={index}>{text}</div>
        </Dom>
        <Text left={left} right={!left} size={w * 0.04} color={color} top position={[((left ? -w : w) * size) / 2, (w * size) / aspect / 2 + 0.5, -1]}>
          {header}
        </Text>
        <Block factor={0.2}>
          <Text opacity={0.5} size={w * 0.1} color="#1A1E2A" position={[((left ? w : -w) / 2) * size, (w * size) / aspect / 1.5, -10]}>
            {"0" + (index + 1)}
          </Text>
        </Block>
      </group>
    </Block>
  )
}

function Content() {
  const images = useLoader(
    TextureLoader,
    state.paragraphs.map(({ image }) => image)
  )
  useMemo(() => images.forEach(texture => (texture.minFilter = LinearFilter)), [images])
  const { contentMaxWidth: w, canvasWidth, canvasHeight, mobile } = useBlock()
  return (
    <>
      <Block factor={1} offset={0}>
        <Block factor={1.2} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Text left size={w * 0.05} position={[w*-1.5 / 3.2, 2.5, -1]} color="#d4bc07">
            OHMIO BROADCAST
          </Text>
          <Text left size={w * 0.05} position={[w*-1 / 3.2, 0.5, -1]} color="#afafaf">
            NAB SHOW 2023
          </Text>
        </Block>
        <Block factor={1.0}>
          <Dom position={[-w / 3.2, -w * 0.08 + 0.25, -1]}>Introducing{mobile ? <br /> : " "}the future of Broadcast industry empowering Blockchain Technology</Dom>
        </Block>
      </Block>
      <Block factor={1.2} offset={5.7}>
        <MultilineText top left size={w * 0.15} lineHeight={w / 5} position={[-w*1.7 / 3.5, 0, -1]} color="#2fe8c3"  text={"Broadcast\nWeb 3.0\nIoT"} />
      </Block>
      {state.paragraphs.map((props, index) => (
        <Paragraph key={index} index={index} {...props} image={images[index]} />
      ))}
      {state.stripes.map(({ offset, color, height }, index) => (
        <Block key={index} factor={-1.5} offset={offset}>
          <Plane args={[50, height, 32, 32]} shift={-4} color={color} rotation={[0, 0, Math.PI / 8]} position={[0, 0, -10]} />
        </Block>
      ))}
      <Block factor={1.25} offset={8}>
        <Dom className="bottom-left" position={[-canvasWidth / 2, -canvasHeight / 2, 0]} style={{color:'white'}}>
          Broadcast Powered by Web 3.0
        </Dom>
      </Block>
    </>
  )
}

function App() {
  const scrollArea = useRef()
  const onScroll = e => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({ target: scrollArea.current }), [])
  return (
    <>
      <Canvas className="canvas" concurrent pixelRatio={1} orthographic camera={{ zoom: state.zoom, position: [0, 0, 500] }}>
        <Suspense fallback={<Dom center className="loading" children="Loading..." />}>
          <Content />
          <Diamonds />
          <Startup />
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        {new Array(state.sections).fill().map((_, index) => (
          <div key={index} id={"0" + index} style={{ height: `${(state.pages / state.sections) * 100}vh` }} />
        ))}
      </div>
      <div className="frame">
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <img alt="logoohmio" src="/moneda.png" style={{width:'3rem', marginRight:'1rem'}} />

        <h1 className="frame__title" style={{color:'white'}}>OHMIO BROADCAST at NAB Event 2023</h1>

        </div>
        <div className="frame__links">

          <a className="frame__link" href="https://ohmiobroadcast.io/" style={{color:'white'}}>
            Home
          </a>
          <a className="frame__link" href="#rewards" style={{color:'white'}}>
            Rewards
          </a>
          <a className="frame__link" href="#contact" style={{color:'white'}}>
            Contact
          </a>
        </div>
        <div className="frame__nav" >
          <a className="frame__link" href="#00" children="intro" style={{color:'white'}}/>
          <a className="frame__link" href="#01" children="01" style={{color:'white'}}/>
          <a className="frame__link" href="#02" children="02" style={{color:'white'}}/>
          <a className="frame__link" href="#03" children="03" style={{color:'white'}}/>
          <a className="frame__link" href="#04" children="04" style={{color:'white'}}/>
          <a className="frame__link" href="#05" children="05" style={{color:'white'}}/>
          <a className="frame__link" href="#07" children="06" style={{color:'white'}}/>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
