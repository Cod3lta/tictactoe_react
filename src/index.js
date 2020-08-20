import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}
  
class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => {this.props.onClick(i)}}
            />
        )
    }
  
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            xIsNext: true,
            stepNumber: 0
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        // Créer une copie du tableau squares
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) return
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        
        this.setState({
            history: history.concat([{
                squares: squares
            }]), 
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
        // Remplacer l'array square par celui qu'on a copié
        // Immutabilité -> mieux (en général) que de remplacer
        // props par props notamment si on a un système de ctrl+z
        // -> détection des modification -> déterminer qu'un component doit être refresh
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const desc = move ?
                'Revenir au tour n°' + move :
                'Revenir au début de la partie'
            return (
                <li key={ move }>
                    <a
                        className="link-history" 
                        onClick={ () => this.jumpTo(move) }>
                        { desc }
                    </a>
                </li>
            )
        })

        let status
        if (winner) status = winner + ' a gagné !'
        else status = 'Joueur : ' + (this.state.xIsNext ? 'X' : 'O')

        return (
            <div className="game">
            <h1 id="title">Morpion</h1>
                <div className="game-center">
                    <div className="game-board">
                        <Board 
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <div>{ status }</div>
                            <div className="history-container" id="history-container">
                                <ol>{ moves }</ol>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        var objDiv = document.getElementById("history-container")
        objDiv.scrollTop = objDiv.scrollHeight
    }
}

  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
)
  
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}