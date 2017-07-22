import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      searchContent: '',
      data: {},
      isOpen: false,
      isSearched: false
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.getAPI = this.getAPI.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
  }

  handleSearch(e) {
    if (e.key === 'Enter') {
      let val = e.target.value
      this.setState({searchContent: val, isSearched: true})
      if (val) this.getAPI(val)
    }
  }

  handleClick() {
    this.setState({isOpen: true})
  }

  handleOnBlur() {
    if (!this.state.isSearched) {
      this.setState({isOpen: false})
    }
  }

  getAPI(value) {
    const api = 'https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=search&gsrlimit=10&prop=extracts&exintro&explaintext&exsentences=1&gsrsearch='
    let url = api + value
    fetch(url).then(raw => raw.json()).then(data => {
      setTimeout(()=> {
        console.log(data.query.pages)
        this.setState({
          data: data.query.pages
        })
        console.log(url)
      },0)
    })
  }

  render() {
    const contentStyles = {
      unSearch: {
        marginTop: '35%',
        transform: 'translateY(-50%)',
        transition: 'margin 0.75s'
      },
      Searched: {
        marginTop: 0,
        transition: 'margin 0.75s'
      }
    }
    return (
      <div className="App">
        <div className="content" style={this.state.isSearched ? contentStyles.Searched : contentStyles.unSearch}>
          <Search handleSearch={this.handleSearch}
                  handleClick={this.handleClick}
                  isOpen={this.state.isOpen}
                  handleOnBlur={this.handleOnBlur}/>
          <List data={this.state.data} />
        </div>
      </div>
    );
  }

}

const Search = ({isOpen, handleSearch, handleClick, handleOnBlur}) => {
  const baseStyles = {
    close: {
      width: '1.8em',
      padding: 0,
      borderWidth: 3,
      transition: 'width 0.75s cubic-bezier(0, 0.795, 0, 1)'
    },
    open: {
      width: '428px',
      paddingLeft: '1.2em',
      borderWidth: 2,
      transition: 'width 0.75s cubic-bezier(0, 0.795, 0, 1)'
    }
  }
  const openState = isOpen ? baseStyles.open : baseStyles.close
  return (
    <div className="input">
      <input type="text" onKeyPress={handleSearch} onClick={handleClick} style={openState} onBlur={handleOnBlur}/>
      <div></div>
      <p>
        <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank" rel="noopener noreferrer">
          Click Here For Random Search
        </a>
      </p>
    </div>
  )
}

const List = ({data}) => {
  return (
    <div className="reslist">
      {Object.values(data).map(obj => (
          <a href={`https://en.wikipedia.org/?curid=${obj.pageid}`} target="_blank">
            <div className="resblock" key={obj.title}>
              <h3>{obj.title}</h3>
              <p>{obj.extract}</p>
            </div>
          </a>
      ))}
    </div>
  )
}

export default App;
