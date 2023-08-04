import React from 'react'

const Colours = () => {

    const discord_colours = [
        '#1E2124',
        '#282b30',
        '#36393e',
        '#424549',
        '#7289da',

        '#5865F2',
        '#57F287',
        '#FEE75C',
        '#EB459E',
        '#ED4245',
    ]

    const createBox = (array) => {

        return array.map((color,i) => <div key={i} className={ 'box'}  style={{backgroundColor: color}} ></div>)
    }

  return createBox(discord_colours)
}

export default Colours