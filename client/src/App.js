import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';
import { Image } from "react-bootstrap";

/*spotify web api library courtesy of Jose M Perez: https://github.com/jmperez/spotify-web-api-js */
const spotifyApi = new SpotifyWebApi();

class NowPlaying extends Component {
  constructor() {
    /* this getHash code is coming from the spotify example */
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' }
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  
  render() {
    return (
      <div className="NowPlaying">
        <a href='http://localhost:8888' > Login to Spotify </a>
      <div>
        Now Playing: { this.state.nowPlaying.name }
      </div>
      <div>
        <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
      </div>
      { this.state.loggedIn &&
        <button onClick={() => this.getNowPlaying()}>
          Check Now Playing
        </button>
      }

      
    </div>
    
    );
  }
}

export class GetRecents extends Component {

  constructor() {
    /* this getHash code is coming from the spotify example */
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
      loggedIn: token ? true : false,
      size: 0,
      songs: []
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getRecentTracks(){
    let recentTracks = [];
    spotifyApi.getMyRecentlyPlayedTracks({limit: 5})
      .then((response)=>{
        console.log(response);
        for (let i =0 ; i < response.items.length; i++){
          let song = {
            title : response.items[i].track.name,
            artist : response.items[i].track.artists[0].name,
            image : response.items[i].track.album.images[0].url
          }
          recentTracks.push(song)
        }
        console.log(recentTracks);
        this.setState({
          size: recentTracks.length,
          songs : recentTracks.slice()
        });
      })
  }

  render() {

    //if (this.state.loggedIn) {
      //let songs = this.getRecentTracks();
   // }
    //this.getRecentTracks();
    let songs = this.state.songs;
    console.log(this.state.size);
    let rows = [];
    for (var i = 0; i < this.state.size; i++){
      let rowID = `row${i}`
      let cell = []
      for (var idx = 0; idx < 3; idx++){
        let cellID = `cell${i}-${idx}`
        if (idx === 0){
          cell.push(
            <td key={cellID} id={cellID}>
              <Image
                src={songs[i].image}
                alt="album art"
                width="75"
                height="75"
                rounded
              />
            </td>)
        }
        else if (idx === 1){
          cell.push(<td key={cellID} id={cellID}>{songs[i].title}</td>)
        }
        else{
          cell.push(<td key={cellID} id={cellID}>{songs[i].artist}</td>)
        }
      }
      rows.push(<tr key={i} id={rowID}>{cell}</tr>)
    }

    return(
      
      <div className = "GetRecents" >
        <div>
          { this.state.loggedIn &&
          <button onClick={() => this.getRecentTracks()}>
            Check recents
          </button>
          }
        </div>
        <div className="container">
        <div className="row">
          <div className="col s12 board">
            <table id="simple-board">
               <tbody>
                 {rows}
               </tbody>
             </table>
          </div>
        </div>
      </div>
      </div>

    )

  }


}

export default NowPlaying;
//export  GetRecents;