import React, { Component } from 'react'
import Particles from 'react-tsparticles'

const options = {
    "background": {
        "color": {
            "value": "#ffffff"
        }
    },
    "fullScreen": {
        "enable": false,
    },
    "interactivity": {
        "events": {
            "onClick": {
                "enable": true,
                "mode": "push"
            },
            "onHover": {
                "enable": true,
                "mode": "repulse"
            }
        }
    },
    "particles": {
        "color": {
            "value": "#404040",
            "animation": {
                "h": {
                    "enable": true,
                    "speed": 20
                }
            }
        },
        "links": {
            "color": {
                "value": "#86878a"
            },
            "enable": true,
            "opacity": 0.4
        },
        "move": {
            "enable": true,
            "outModes": {
                "bottom": "out",
                "left": "out",
                "right": "out",
                "top": "out"
            },
            "speed": 6
        },
        "number": {
            "density": {
                "enable": true
            },
            "value": 80
        },
        "opacity": {
            "value": 0.5
        },
        "size": {
            "value": {
                "min": 0.1,
                "max": 3
            }
        }
    }
}

export default class Canvas extends Component {
    render() {
        return (
            <div>
                <Particles
                    options={options}
                    className="particles"
                />
            </div>
        )
    }
}
