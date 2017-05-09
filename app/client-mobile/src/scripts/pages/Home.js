import React, { Component as BaseComponent } from 'react'
import { Link } from 'react-router-dom'

export default class Home extends BaseComponent {
  render() {
    return (
      <div>
        Hello world!!!
        <br/>
        <Link to='/m/my'>我的首页</Link>
      </div>
    )
  }
}