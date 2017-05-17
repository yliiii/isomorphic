import React from 'react'
import path from 'path'
import { Route } from 'react-router-dom'


let autoKey = 0

function routerPase(config, routerPath) {
  if (!routerPath) autoKey = 0
  if (!config || !config.length) return

  let routerArray = []

  config.forEach(function(routerConfig) {
    const { routes, ...routerProp } = routerConfig

    if (routerPath) {
      routerProp.path = path.join(routerPath, routerProp.path)
    }

    routerArray.push(
      <Route {...routerProp} key={`${autoKey}_${new Date().getTime()}`} />
    )

    autoKey++

    if (routes) {
      routerPase(routes, routerProp.path).forEach(router => routerArray.push(router))
    }
  })

  return routerArray
}

export default routerPase

export function matchComponents(config, routerPath) {
  if (!config || !config.length) return

  let routerMatch = {}

  config.forEach(function(routerConfig) {
    const { routes, ...routerProp } = routerConfig

    if (routerPath) {
      routerProp.path = path.join(routerPath, routerProp.path)
    }
    
    routerMatch[routerProp.path] = routerConfig

    if (routes) {
      routerMatch = { ...routerMatch, ...matchComponents(routes, routerProp.path) }
    }
  })

  return routerMatch
}