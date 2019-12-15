import React from 'react';
import firebase from "firebase/app";

class StorImage extends React.Component {

  constructor(props) {
    super(props);
    //console.log(props.default, props);
    this.state = {
      default: props.default === undefined ? `http://holder.ninja/${props.width || 100}x${props.height || 100}.svg` :
        props.default,
      url: null,
      textActive: props.textActive,
      textPassive: props.textPassive,
      classActive: props.classActive || 'btn btn-default text-primary',
      classPassive: props.classPassive || 'btn btn-default',
      iconActive: props.iconActive || 'fa fa-check',
      iconPassive: props.iconPassive || 'fa fa-times',
      iconLoading: props.iconLoading || 'fa fa-circle-notch fa-spin',
      status: props.status,
      loading: props.loading
    };
    this.getImage(props.src);
  }

  onClick = (e) => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    this.props.toggleFunction()
    // .then(response => {
    //     console.log('toggleFunction', this.state.textActive);
    //     // this.setState({
    //     //     status: typeof response === 'boolean' ? response : this.state.status,
    //     //     loading: false
    //     // });
    // })
  };

  // componentDidUpdate = (props) => {
  //     this.setState({
  //         status: props.status,
  //         loading: false
  //     });
  // };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.src !== this.props.src)
      this.getImage(nextProps.src);
    return true
  }


  getImage = (src) => {
    //console.log({src}, typeof src);
    if (!src || src === 'undefined.png' || typeof src === 'object') return null;
    // console.log("AVATAR", src);
    const storage = firebase.storage();
    storage.ref('images').child(src).getDownloadURL()
      .then(
        url => {
          //console.log("AVATAR");
          const image = new Image();
          image.onload = () => {
            this.setState({
              url
            })
          };
          image.src = url;
        }
      );
  };

  checkSrc(src) {
    console.log('checkSrc', this.props.default === undefined, !(!src || src === 'undefined' || src === 'undefined.png' || typeof src === 'object'));
    return !(!src || src === 'undefined' || src === 'undefined.png' || typeof src === 'object')
  }

  render() {
    console.log('default', this.checkSrc(this.props.src), this.state.default);
    return this.checkSrc(this.props.src) ? (
        this.state.url
          ? <img {...this.props} src={this.state.url}/>
          : (this.props.width || this.props.height ?
          <svg {...this.props} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
               viewBox={`0 0 ${this.props.width} ${this.props.height}`}>
            <defs>
              <linearGradient id="flow" x1="100%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E1E3E4" stopOpacity="1">
                  <animate
                    attributeName="stop-color"
                    values="#E1E3E4;#E1E3E4;#D1D3D4;#E1E3E4;#E1E3E4;"
                    keyTimes="0;.25;.5;.75;1"
                    dur="2s"
                    repeatCount="indefinite"/>
                </stop>
              </linearGradient>
            </defs>
            <rect fill="url(#flow)" stroke="#888" strokeOpacity=".5" strokeWidth="1" width={this.props.width}
                  height={this.props.height}/>
          </svg> : null)
      )
      : (this.state.default
        ? <img {...this.props} src={this.state.default}/>
        : null)
  }
}


export default React.forwardRef((props, ref) =>
  (
    <StorImage {...props} forwardref={ref}/>
  )
)

