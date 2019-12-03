import React, { Component } from 'react';
import logo from './logo.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';

library.add(faSearch)

class App extends Component {
  
    
  constructor(){
    super();
    this.state = {
      chartData:{},
      isLoaded: false,
      checked: false
    };
    this.toggleGraph = this.toggleGraph.bind(this);
    this.getLanguageInsights = this.getLanguageInsights.bind(this);
  }

  componentDidMount(){
    this.getChartData();
    // this.timer = setInterval(() => this.getChartData(), 5000);
  }

  // componentWillUnmount() {
  //     clearInterval(this.timer);
  //     this.timer = null;
  // }

  getChartData = () => {
    // Ajax calls here
    fetch("http://127.0.0.1:5000/tags")
    .then(res => res.json())
    .then((result) => {
        this.setState({
            chartData: {
              labels: Object.keys(result),
              datasets:[
                {
                  label:'Number of Questions',
                  data: Object.values(result)
                }
              ],
              backgroundColor: Object.values(this.formatData(result)),
              // strokeColor: "rgba(220,220,220,0.8)", 
              // highlightFill: "rgba(220,220,220,0.75)",
              // highlightStroke: "rgba(220,220,220,1)",
            },
            isLoaded: true
          }, function() {
            // console.log(this.state.chartData);
          }
        );
    });
  }

  
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return this.hexToRGB(color);
  }

  hexToRGB(h) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length === 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];

    // 6 digits
    } else if (h.length === 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }
  
    return "rgba("  + +r + ", " + +g + ", " + +b + ", 0.6)";
  }

  formatData = (result) => {
    let colors = [];

    for(let key in Object.keys(result)){
      colors.push(this.getRandomColor());
    }
    // console.log(colors);
    return colors;
  }

  toggleGraph() {
    this.setState({
      checked: !this.state.checked
    });
  }

  getLanguageInsights(){
    fetch("http://127.0.0.1:5000/posts")
    .then(res => res.json())
    .then((result) => {
      var tagDict = {};
      var languageSpecificAnsweredCount = {}, languageSpecificViewCount = {};
      var tempResult = Object.values(result);

      // Finding insights logic
      
      for(let item in tempResult){
        for(let tag in tempResult[item]['tags']){
          if(tempResult[item]['is_answered'] === true){
            if(languageSpecificAnsweredCount.hasOwnProperty(tempResult[item]['tags'][tag])){
              languageSpecificAnsweredCount[tempResult[item]['tags'][tag]]++;
            } else {
              languageSpecificAnsweredCount[tempResult[item]['tags'][tag]] = 1;
            }
          } 
          if(tagDict.hasOwnProperty(tempResult[item]['tags'][tag])){
            tagDict[tempResult[item]['tags'][tag]]++;
          } else {
            tagDict[tempResult[item]['tags'][tag]] = 1;
          }
          if(languageSpecificViewCount.hasOwnProperty(tempResult[item]['tags'][tag])){
            languageSpecificViewCount[tempResult[item]['tags'][tag]] += tempResult[item]['view_count'];
          } else {
            languageSpecificViewCount[tempResult[item]['tags'][tag]] = tempResult[item]['view_count'];
          }
        }
      }

      // Finding Top 5 posts logic
      var topPostsStruct = {};
      for(let item in tempResult){
        for(let tag in tempResult[item]['tags']){
          if(topPostsStruct.hasOwnProperty(tempResult[item]['tags'][tag])){
            topPostsStruct[tempResult[item]['tags'][tag]].push({
              'title': tempResult[item]['title'],
              'link': tempResult[item]['link'],
              'views': tempResult[item]['view_count']
            });
          } else {
            topPostsStruct[tempResult[item]['tags'][tag]] = [];
            topPostsStruct[tempResult[item]['tags'][tag]].push({
              'title': tempResult[item]['title'],
              'link': tempResult[item]['link'],
              'views': tempResult[item]['view_count']
            });
          }
          
        }
      }


      var searchText = document.getElementById('search-text').value;
      if(searchText === "") alert("Please enter some language specific query");
      
      var tagSortedList = topPostsStruct[searchText];
      if(tagSortedList == null || tagSortedList == undefined) {
        alert("Can not find query using API! Please try again later...");
        return;
      }
      tagSortedList.sort((a, b) => (a.views < b.views) ? 1 : -1)
    
      var q1 = document.getElementById('q1');
      var div1 = document.createElement('a');
      div1.innerText = tagSortedList[0].title;
      div1.setAttribute('href', tagSortedList[0].link);
      if(q1.firstChild != null) q1.firstChild.remove();
      q1.appendChild(div1);

      var q2 = document.getElementById('q2');
      var div2 = document.createElement('a');
      div2.innerText = tagSortedList[1].title;
      div2.setAttribute('href', tagSortedList[1].link);
      if(q2.firstChild != null) q2.firstChild.remove();
      q2.appendChild(div2);

      var q3 = document.getElementById('q3');
      var div3 = document.createElement('a');
      div3.innerText = tagSortedList[2].title;
      div3.setAttribute('href', tagSortedList[2].link);
      if(q3.firstChild != null) q3.firstChild.remove();
      q3.appendChild(div3);

      var q4 = document.getElementById('q4');
      var div4 = document.createElement('a');
      div4.innerText = tagSortedList[3].title;
      div4.setAttribute('href', tagSortedList[3].link);
      if(q4.firstChild != null) q4.firstChild.remove();
      q4.appendChild(div4);

      var q5 = document.getElementById('q5');
      var div5 = document.createElement('a');
      div5.innerText = tagSortedList[4].title;
      div5.setAttribute('href', tagSortedList[4].link);
      if(q5.firstChild != null) q5.firstChild.remove();
      q5.appendChild(div5);

      // Displaying insights and Top 5 posts logic

      var avgAnsweredCount = languageSpecificAnsweredCount[searchText] / tagDict[searchText];
      var avgViewCount = languageSpecificViewCount[searchText] / tagDict[searchText];

      // console.log(tagDict);
      // console.log(languageSpecificAnsweredCount);
      // console.log(languageSpecificViewCount);
        
      var questions = document.getElementById('questions');
      questions.innerText = tagDict[searchText];

      var answers = document.getElementById('answers');
      answers.innerText = languageSpecificAnsweredCount[searchText];

      var answer_count = document.getElementById('answer-count');
      answer_count.innerText = avgAnsweredCount;

      var view_count = document.getElementById('view-count');
      view_count.innerText = avgViewCount;
    });
  }

  render() {
    const content = this.state.checked 
      ? <div className='bar-col'>{this.state.isLoaded ? <BarChart chartData={this.state.chartData} location="" legendPosition="bottom"/> : <div> Still loading graph ... </div>}</div>
      : <div className='pie-col'>{this.state.isLoaded ? <PieChart chartData={this.state.chartData} location="" legendPosition="bottom" hidden/>: <div> Still loading graph ... </div>}</div>;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>StackExchange Insights</h2>
        </div>
        <div className="input-group md-form form-sm form-2 pl-0">
          <input id="search-text" className="form-control my-0 py-1 lime-border" type="text" placeholder="Search" aria-label="Search" />
          <div className="input-group-append">
            <button className="input-group-text lime lighten-2 lime-border" id="search-btn" onClick={this.getLanguageInsights}>
              {/* <i class="fas fa-search text-grey" aria-hidden="true"></i> */}
              <FontAwesomeIcon icon="search" />
            </button>
          </div>
        </div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>
                <label className="switch">
                  <input type="checkbox" checked={ this.state.checked } onChange={ this.toggleGraph } />
                  <span className="slider round"></span>
                </label> 
                {content}
              </td>
              <td>
                <h3 id="insights-heading">
                    Insights
                </h3>
                <table id="insights-table"  className="table-dark table-hover">
                  <tbody>
                    <tr>
                      <th>No. of Questions</th>
                      <th>No. of Answered Questions</th>
                    </tr>
                    <tr>
                      <td id="questions"></td>
                      <td id="answers"></td>
                    </tr>
                    <tr>
                      <th>Avg. Answer Count</th>
                      <th>Avg. View Count</th>
                    </tr>
                    <tr>
                      <td id="answer-count"></td>
                      <td id="view-count"></td>
                    </tr>
                  </tbody>
                </table>
                <div id="top-posts">
                  
                  <table className="table-hover">
                    <thead>
                      <tr>
                        <th>
                          <h3 id="top-posts-heading">
                              Top 5 Posts
                          </h3>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr id="q1"></tr>
                      <tr id="q2"></tr>
                      <tr id="q3"></tr>
                      <tr id="q4"></tr>
                      <tr id="q5"></tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    );
  }
}

export default App;