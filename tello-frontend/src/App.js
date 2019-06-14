import React from 'react';
import './App.css';
import socket from './socket.js';
import Modal from 'react-bootstrap4-modal';

const keyCodes = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  flip_forward: 87,
  flip_right: 68,
  flip_backward: 83,
  flip_left: 65,
  takeoff: 32,
  land: 18,
  higher: 85,
  lower: 74,
  rotate_left: 75,
  rotate_right: 76,
}
const key_action = [
  { action: "TAKEOFF", key: "SPACE" },
  { action: "LAND", key: "ALT" },
  { action: "MOVE LEFT", key: "ARROW LEFT" },
  { action: "MOVE FORWARD", key: "ARROW UP" },
  { action: "MOVE RIGHT", key: "ARROW RIGHT" },
  { action: "MOVE BACKWARD", key: "ARROW DOWN" },
  { action: "FLIP LEFT", key: String.fromCharCode(keyCodes.flip_left) },
  { action: "FLIP FORWARD", key: String.fromCharCode(keyCodes.flip_forward) },
  { action: "FLIP RIGHT", key: String.fromCharCode(keyCodes.flip_right) },
  { action: "FLIP BACKWARD", key: String.fromCharCode(keyCodes.flip_backward) },
  { action: "MOVE UP", key: String.fromCharCode(keyCodes.higher) },
  { action: "MOVE DOWN", key: String.fromCharCode(keyCodes.lower) },
  { action: "ROTATE CLOCKWISE", key: String.fromCharCode(keyCodes.rotate_right) },
  { action: "ROTATE COUNTER CLOCKWISE", key: String.fromCharCode(keyCodes.rotate_left) },
];
function sendCommand(command) {
  return function () {
    console.log(`Sending the command ${command}`);
    socket.emit('command', command);
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myDiv = React.createRef();
  }
  state = {
    status: "Please send first command",
    horizontalValue: 20,
    heightValue: 20,
    rotationValue: 90,
    isModalVisible: false,
  }
  componentDidMount() {
    socket.on('status', (message) => {
      return this.changeStatus(message)
    });
    this.myDiv.current.addEventListener('keydown', this.handleKey);
    this.myDiv.current.focus();
  }
  componentWillUnmount() {
    this.myDiv.current.removeEventListener('keydown', this.handleKey);
  }
  handleKey = (e) => {
    switch (e.keyCode) {
      case keyCodes.up: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`forward ${this.state.horizontalValue}`)
        break;
      }
      case keyCodes.down: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`back ${this.state.horizontalValue}`)
        break;
      }
      case keyCodes.left: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`left ${this.state.horizontalValue}`)
        break;
      }
      case keyCodes.right: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`right ${this.state.horizontalValue}`)
        break;
      }
      case keyCodes.takeoff: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`takeoff`)
        break;
      }
      case keyCodes.land: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`land`)
        break;
      }
      case keyCodes.rotate_left: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`ccw ${this.state.rotationValue}`)
        break;
      }
      case keyCodes.rotate_right: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`cw ${this.state.rotationValue}`)
        break;
      }
      case keyCodes.higher: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`up ${this.state.heightValue}`)
        break;
      }
      case keyCodes.lower: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`down ${this.state.heightValue}`)
        break;
      }
      case keyCodes.flip_forward: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`flip f`)
        break;
      }
      case keyCodes.flip_backward: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`flip b`)
        break;
      }
      case keyCodes.flip_left: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`flip l`)
        break;
      }
      case keyCodes.flip_right: {
        e.preventDefault();
        this.sendCommandFromKeyboard(`flip r`)
        break;
      }
      default: break;
    }
  }
  changeStatus = (message) => {
    this.setState({ status: message })
  }
  changeHeightValue = (e) => {
    let value = e.target.value;
    this.setState({ heightValue: value });
  }
  changeHorizontalValue = (e) => {
    let value = e.target.value;
    this.setState({ horizontalValue: value });
  }
  changeRotationValue = (e) => {
    let value = e.target.value;
    this.setState({ rotationValue: value });
  }
  sendCommandFromKeyboard = (command) => {
    console.log(`Sending the command from keyboard ${command}`);
    socket.emit('command', command);
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }

  render() {
    return (
      <div className="App" ref={this.myDiv} tabIndex="1" >
        <h1 className="heading">Tello Drone Command Board</h1>
        <hr className="hr" />
        <div className="status-wrap">
          <span className="status-message">COMMAND STATUS : <span className={this.state.status === "OK" ? "command-status ok" : "command-status "}>{this.state.status}</span></span>
          <button className="btn btn-success" onClick={this.toggleModal}>Check Key Bindings</button>
        </div>
        <br />
        <span className="label"> Change height value (20 - 500 cm)</span>
        <input type="number" placehodler="Height value" value={this.state.heightValue} onChange={this.changeHeightValue} />
        <br />
        <span className="label"> Change horizontal move value (20 - 500 cm)</span>
        <input type="number" placehodler="Height value" value={this.state.horizontalValue} onChange={this.changeHorizontalValue} />
        <br />
        <span className="label"> Change rotation amount in degrees (1 - 3600 degrees)</span>
        <input type="number" placehodler="Height value" value={this.state.rotationValue} onChange={this.changeRotationValue} />

        <div className="commands-container">

          <div className="command-section-1" >
            <button className="my-btn btn-takeoff" onClick={sendCommand('takeoff')}>
              Take Off
            </button>
            <button className="my-btn btn-land" onClick={sendCommand('land')}>
              Land
            </button>
          </div>

          <div className="command-section-2">
            <button className="my-btn btn-section-2 btn-height btn-up" onClick={sendCommand(`up ${this.state.heightValue}`)}>
              <span className="symbol"><i className="fa fa-arrow-up"></i></span> {this.state.heightValue} cm
            </button>
            <button className="my-btn btn-section-2 btn-rotate-c" onClick={sendCommand(`ccw ${this.state.rotationValue}`)}>
              <span className="symbol">⟳</span> {this.state.rotationValue}
            </button>
            <button className="my-btn btn-section-2 btn-height btn-down" onClick={sendCommand(`down ${this.state.heightValue}`)}>
              <span className="symbol"><i className="fa fa-arrow-down"></i></span> {this.state.heightValue} cm
            </button>
            <button className="my-btn btn-section-2 btn-rotate-cc" onClick={sendCommand(`cw ${this.state.rotationValue}`)}>
              <span className="symbol">⟲</span> {this.state.rotationValue}
            </button>
          </div>

          <div className="command-section">
            <div className="up-wrap">
              <button className="my-btn btn-flip btn-flip-f" onClick={sendCommand('flip f')}>
                <span><i className="fa fa-arrow-up"></i></span>
              </button>
            </div>
            <div className="middle-wrap">
              <button className="my-btn btn-flip btn-flip-l" onClick={sendCommand('flip l')}>
                <span><i className="fa fa-arrow-left"></i></span>
              </button>
              <span className="action-name">FLIP</span>
              <button className="my-btn btn-flip btn-flip-r" onClick={sendCommand('flip r')}>
                <span><i className="fa fa-arrow-right"></i></span>
              </button>
            </div>
            <div className="down-wrap">
              <button className="my-btn btn-flip btn-flip-b" onClick={sendCommand('flip b')}>
                <span><i className="fa fa-arrow-down"></i></span>
              </button>
            </div>
          </div>

          <div className="command-section">
            <div className="up-wrap">
              <button className="my-btn btn-horizontal btn-forward" onClick={sendCommand(`forward ${this.state.horizontalValue}`)}>
                <span><i className="fa fa-arrow-up"></i></span>
              </button>
            </div>
            <div className="middle-wrap">
              <button className="my-btn btn-horizontal btn-left" onClick={sendCommand(`left ${this.state.horizontalValue}`)}>
                <span><i className="fa fa-arrow-left"></i></span>
              </button>
              <span>{this.state.horizontalValue} cm</span>
              <button className="my-btn btn-horizontal btn-right" onClick={sendCommand(`right ${this.state.horizontalValue}`)}>
                <span><i className="fa fa-arrow-right"></i></span>
              </button>
            </div>
            <div className="down-wrap">
              <button className="my-btn btn-horizontal btn-back" onClick={sendCommand(`back ${this.state.horizontalValue}`)}>
                <span><i className="fa fa-arrow-down"></i></span>
              </button>
            </div>
          </div>
        </div>

        <Modal visible={this.state.isModalVisible} onClickBackdrop={this.toggleModal}>
          <div className="modal-header">
            <h5 className="modal-title">Key bindings</h5>
          </div>
          <div className="modal-body">
            <p >Here you can see key bindings for sending commands to your Tello drone.</p>
            <table className="key-table">
              <tbody>
                <tr>
                  <th>KEY</th>
                  <th className="right">ACTION</th>
                </tr>
                {
                  (key_action.map(item => (
                    <tr key={item.key}>
                      <td className="left">{item.key}</td>
                      <td className="right">{item.action}</td>
                    </tr>
                  )))
                }
              </tbody>
            </table>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-success" onClick={this.toggleModal}>
              OK
          </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;