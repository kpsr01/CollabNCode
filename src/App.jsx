import React from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Editorpage from './pages/Editor/Editorpage'
import { Analytics } from "@vercel/analytics/react"

function CollabNCode() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/editor' element={<Home />}></Route>
          <Route path='/editor/:roomid' element={<Editorpage />}></Route>
        </Routes>
      </BrowserRouter>
      <Analytics mode={'production'} />
    </>
  )
}

export default CollabNCode