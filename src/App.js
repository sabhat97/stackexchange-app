import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';

class App extends Component {
  constructor(){
    super();
    this.state = {
      chartData:{}
    }
  }

  componentWillMount(){
    this.getChartData();
  }

  getChartData(){
    // Ajax calls here
    this.setState({
      chartData:{
        labels: ['Java', 'JavaScript', 'C++', 'C', 'MySQL', 'HTML'],
        datasets:[
          {
            label:'Users',
            data:[
              617594,
              181045,
              153060,
              106519,
              105162,
              95072
            ],
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ]
          }
        ]
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">

          <img src={logo} className="App-logo" alt="logo" />
          <h2>StackExchange</h2>
        </div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td className='bar-col'> <BarChart chartData={this.state.chartData} location="" legendPosition="bottom"/></td>
              <td className='pie-col'><PieChart chartData={this.state.chartData} location="" legendPosition="bottom"/></td>
            </tr>
          </tbody>
        </table>
       
        
      </div>
    );
  }
}

export default App;