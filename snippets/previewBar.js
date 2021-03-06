import '../css/fonts.css';
// import '../snippets/demo.css';

class PreviewBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ...props.barConfig,
      styleCode:'',
    };
    this.htmlRef = React.createRef();
    this.firstLineRefwG = React.createRef();
    this.firstLineRefGA = React.createRef();
    this.closeBtn = React.createRef();
    this.topBar = React.createRef();
    this.injectHtml = this.injectHtml.bind(this);
    this.setAnimation = this.setAnimation.bind(this);
    this.renderBarFirstLine = this.renderBarFirstLine.bind(this);
    this.renderInnerBar = this.renderInnerBar.bind(this);
    this.handleLinkContainer = this.handleLinkContainer.bind(this);
  }

  setAnimation(el,childToQuery){
    let keyframeEl = document.createElement('style');
    keyframeEl.textContent = `
      @keyframes infiniteSlide{
          from {
            margin-top:0
          }
          to {
            margin-top: -22px
          }
      }
    `;
    el.insertAdjacentElement('afterbegin',keyframeEl);
    el.setAttribute('style',"padding:0;margin:0;list-style:none;transition:all 2.5s;animation:infiniteSlide 2.5s;");
    el.addEventListener('animationend',function(){
      el.style.animation = '';
      void el.offsetWidth;
      let elNode = el.children[0].parentNode;
      let firstChild = elNode.querySelector(childToQuery);
      let clonedFirstChild = firstChild.cloneNode(true);
      elNode.insertAdjacentElement('beforeend',clonedFirstChild);
      elNode.removeChild(firstChild);
      el.style.animation = 'infiniteSlide 2.5s';
    })
  }

  componentDidMount(){
    // handle injected html
    this.handleLinkContainer(this.htmlRef);
    this.handleLinkContainer(this.firstLineRefwG);
    this.handleLinkContainer(this.firstLineRefGA);

    
    // handle closing action
    let closeBtn = this.closeBtn.current;
    closeBtn.addEventListener('click',(e)=>{
      // #todo add script when appending to page to hide the bar element
    })
  }

  handleLinkContainer(sp){
    if(sp.current){
      let injectedHtmlElCollection = sp.current.children; // object
      for(let n=0;n<injectedHtmlElCollection.length;n++){
        let el = injectedHtmlElCollection[n];
        if(el.classList.contains('link-container')){
          el.setAttribute("style","height:22px;overflow:hidden;line-height:22px;");
          if(el.children[0] && el.children[0].tagName==='UL'){
            let ul = el.children[0];
            ul.setAttribute('style',"margin:0;");
            if(ul.children[1]){
              this.setAnimation(ul,'li');
            }
          }
        }
      }
    }
  }

  static getDerivedStateFromProps(nextProps,prevState){
    let ifChange = false;
    for(var [key,val] of Object.entries(nextProps.barConfig)){
      if(nextProps.barConfig[key] !== prevState[key]){
        ifChange = true;
      }
    }
    if(nextProps.codes.style && nextProps.codes.style !== prevState.styleCode){
      PreviewBar.injectStylesheet(nextProps.barConfig,nextProps.codes.style);
      return {...prevState,styleCode:nextProps.codes.style}
    }
    if(ifChange){
      PreviewBar.injectStylesheet(nextProps.barConfig,nextProps.codes.style);
      return {...prevState,...nextProps.barConfig};
    }else{
      return null;
    }
  }

  componentDidUpdate(){
    this.handleLinkContainer(this.htmlRef);
    this.handleLinkContainer(this.firstLineRefwG);
    this.handleLinkContainer(this.firstLineRefGA);
    console.log('finished top bar',this.topBar.current);
  }


  injectHtml(html){
    let style_basic = {textAlign:'center'};
    return (
      <span dangerouslySetInnerHTML={{__html:html}} ref={this.htmlRef} style={style_basic}></span>
    )
  }

  renderBarFirstLine(barConfig){
    const {goal,inpTxt,spColor} = barConfig;
    return (
      <span><span dangerouslySetInnerHTML={{__html:inpTxt}} ref={this.firstLineRefwG}></span><span style={{color:spColor,fontWeight:400}}>${goal}</span></span>
    )
  }

  renderInnerBar(barConfig){
    const {inpTxt,addedHtml,goal} = barConfig;
    return (
      <div 
        id="ptk_bar"
        className="ptkBar"
      >
        { goal >= 0 ?
          this.renderBarFirstLine(barConfig)
          :
          <span dangerouslySetInnerHTML={{__html:inpTxt}} ref={this.firstLineRefGA}></span>
        }
        { addedHtml?
            this.injectHtml(addedHtml) 
            :
            null
        }
        <div style={{position:'absolute',top:'8px',right:'8px',cursor:'pointer'}} ref={this.closeBtn}>X</div>
      </div>
    )
  };

  static injectStylesheet(barConfig,styleCode){
    const {ftColor,opacity,bgImg,fontFamily,paddingUpDown,fontSize} = barConfig;
    let {bgColor} = barConfig,imgSize=bgImg.size,imgUrl;
    let padding = paddingUpDown? `${paddingUpDown}px 5px` : '8px 5px';

    if(opacity.toString() !== '100'){
      bgColor = PreviewBar._hexToRgba(bgColor,opacity);
    }
    
    if(imgSize){
      imgUrl = 'url("'+window.URL.createObjectURL(bgImg)+'")';
    }

    let styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-style','')
    let al_stylesheet = document.body.querySelector('style[data-style]');
    styleSheet.textContent = `
      #ptk_bar{
        padding:${padding};
        font-size:${fontSize? fontSize +'px' : '18px'};
        line-height:22.5px;
        text-align:center;
        position:relative;
        background-color:${bgColor};
        color:${ftColor};
        background-image:${imgUrl};
        font-family:${fontFamily},sans-serif;
      }
    `;
    if(styleCode){
      styleSheet.textContent += styleCode;
    }
    if(!al_stylesheet){
      document.body.prepend(styleSheet);
    }else{
      document.body.replaceChild(styleSheet,al_stylesheet);
    }
  };

  

  static _hexToRgba(h,op){
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length == 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];

    // 6 digits
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }
    
    return "rgba("+ +r + "," + +g + "," + +b + "," + op/100 + ")";
  }

  render(){
    return (
      <div style={{margin:'20px 0'}}>
        <div ref={this.topBar}>
          { this.props.barLink.url.length !== 0 ?
            <a href={this.props.barLink.url} target={this.props.barLink.openNew? "_blank" : "_self"} style={{textDecoration:'none',color:'initial'}}>
              { this.renderInnerBar(this.props.barConfig) }
            </a>
            :
            this.renderInnerBar(this.props.barConfig)
          }
        </div>
      </div>
    )
  }
}

export default PreviewBar;