import { Card, TextField, Stack, FormLayout, Select, Checkbox, ChoiceList, Collapsible, TextStyle } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import SectionHead from '../snippets/sectionHead';

function NameField(props){
  const [name,setName] = useState(props.name);

  useEffect(()=>{
    props.handleName(name);
  },[name]);

  return ( 
    <Card.Section>
      <TextField label="Name: " value={name} onChange={ (nw) => setName(nw)} />
    </Card.Section>
  )
}

function FreeShippingGoal(props){
  const [goal,setGoal] = useState(props.goal? props.goal : 30);
  const _handleGoalChange = function(newGoal){
    setGoal(newGoal);
    props.handleGoalChange(newGoal)
  }
  return (
    <Card.Section>
      <TextField 
        label="Free Shipping Goal: " 
        type="number"
        value={goal} 
        onChange={(nw) => _handleGoalChange(nw)} 
      />
    </Card.Section>
  );
}

function InitialMsg(props){
  const [msg,setMsg] = useState(props.barTxt.initialMsg1 && props.barTxt.initialMsg1.length > 0 ? props.barTxt.initialMsg1 :'Free Shipping on All Orders Over ');
  const [added,setAdded] = useState(props.barTxt.initialMsg2 ? props.barTxt.initialMsg2 : '');

  useEffect(()=>{
    props.handleMsgChange({initialMsg1:msg,initialMsg2:added});
  },[msg,added])

  return (
    <Card.Section>
      <Stack alignment="center" distribution="fill">
        <TextField
          label="Initial message: "
          type="text"
          value={msg}
          onChange={(nw) => setMsg(nw)}
          helpText="Display when cart is empty"
        />
        <div style={{fontSize:'18px'}}>{props.currency} {props.goal}</div>
        <TextField 
          label=" "
          type="text"
          value={added}
          onChange={(nw) => setAdded(nw)}
        />
      </Stack>
    </Card.Section>
  )
}

function ProgressMsg(props){
  const [msg,setMsg] = useState(
    props.barTxt.prgMsg1 && props.barTxt.prgMsg1.length > 0? 
      props.barTxt.prgMsg1 
      : 
      'Only '
    );
  const [added,setAdded] = useState(
    props.barTxt.prgMsg2 && props.barTxt.prgMsg2.length > 0 ? 
      props.barTxt.prgMsg2 
      : 
      ' away from free shipping'
    );
  const gl = props.goal;

  useEffect(()=>{
    props.handleMsgChange({prgMsg1:msg,prgMsg2:added})
  },[msg,added])

  return (
    <Card.Section condensed>
      <Stack alignment="center" distribution="fill">
        <TextField
          label="Progress message: "
          type="text"
          value={msg}
          onChange={(nw) => setMsg(nw)}
          helpText="Displays when cart value is less than the goal"
        />
        <div style={{fontSize:'18px'}}>{props.currency} {gl-1}</div>
        <TextField 
          label=" "
          type="text"
          value={added}
          onChange={(nw) => setAdded(nw)}
        />
      </Stack>
    </Card.Section>
  )
}

function GoalAchieved(props){
  const [msg,setMsg] = useState(
    props.barTxt.achievedMsg && props.barTxt.achievedMsg.length > 0 ?
      props.barTxt.achievedMsg
      :
      'Free Shipping Worldwide'
    );

  useEffect(()=>{
    props.handleMsgChange({achievedMsg:msg})
  },[msg])

  return (
    <Card.Section>
      <TextField
        label="Goal Achieved Message: "
        type="text"
        value={msg}
        onChange={(nw) => setMsg(nw)}
        helpText="Displays when cart value is greater than goal"
      />
    </Card.Section>
  )
}

function AddLinkToBar(props){
  const [havLink,setHavLink] = useState(
    props.link.url && props.link.url.length > 0 ?
      true
      :
      false);
  const [url,setUrl] = useState(havLink? props.link.url : '');
  const [checkbox,setChecked] = useState(havLink && props.link.openNew? true : false);

  const opts=[
    {label:'Off',value:false},
    {label:'On',value:true}
  ]

  const handleSwitch = (val) => {
    val = val === 'true'? true : false;
    setHavLink(val);
    if(!val){
      props.handleBarLinkChange('');
    }
  }

  const handleCheckbox = (val) => {
    setChecked(val);
    props.handleBarLinkChange(val);
  }

  useEffect(()=>{
    setUrl(props.link.url);
  },[props.link.url])

  return(
    <Card.Section>
      <Select 
        label="Add Link to the Bar: "
        options={opts}
        onChange={handleSwitch}
        value={havLink}
      />
      {
        havLink?
        <div>
          <TextField
            label="Link URL: "
            type="url"
            value={url}
            onChange={(nw) => {setUrl(nw); props.handleBarLinkChange(nw);}}
            helpText="This address will be visited after clicking the bar"
          />
          <Checkbox 
            label="Open the link in a NEW tab when clicked"
            checked={checkbox}
            onChange={(nw) => handleCheckbox(nw)}
          />
        </div>
        :
        null
      }
    </Card.Section>
  )
}

function SetPosition(props){
  const [isSelected,setSelected] = useState(
    props.barPosi && props.barPosi.length > 0?
      props.barPosi
      :  
      ['push-down']
    );

  const choices = [
    {label:'Top bar pushes down the rest of the page',value:'push-down'}, //body padding-top equals to the height of the bar, position: absolute
    {label:'Top bar pushes down the rest of the page (always visible while scrolling)', value:'push-down-visible'}, // body padding-top, and position: -webkit-sticky
    {label:'Top bar overlaps top of the page',value:'overlap'}, //no padding-top for body
    {label:'Top bar overlaps top of the page (always visible while scrolling)',value:'overlap-visible'}, //no padding-top for body, and position:sticky
    {
      label:'Manual placement',
      value:'manual',
      renderChildren:(isSelected)=>{
        return (
          isSelected && (
            <div>Place <TextStyle variation="code">&lt;div id="fsb_placeholder"&gt;&lt;/div&gt;</TextStyle> where you prefer in your theme file.</div>
          )
        )
      }}
  ];

  useEffect(()=>{
    props.handleBarPosition(isSelected);
  },[isSelected])

  return (
    <Card.Section>
      <ChoiceList 
        title={'Select a Display Position: '}
        choices={choices}
        selected={isSelected}
        onChange={(nw) => setSelected(nw)}
      />
    </Card.Section>
  )
}

class ContentConfigPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      frShGl:30,
      msgText:{
        initialMsg1:'Free Shipping on All Orders Over ',
        initialMsg2:'',
        prgMsg1:'Only ',
        prgMsg2:' away from free shipping',
        achievedMsg:'Free Shipping Worldwide'
      },
      name:'',
      sectionActive:true
    }
    this.handleGoalChange = this.handleGoalChange.bind(this);
    this.handleMsgChange = this.handleMsgChange.bind(this);
    this.handleBarLinkChange = this.handleBarLinkChange.bind(this);
  }


  handleGoalChange(newGoal){
    if(parseFloat(newGoal) >= 0){
      this.setState((state) => {
        return {frShGl:parseFloat(newGoal)}
      },function(){
        this.props.handleContentConfig_goal(this.state.frShGl);
      })
    }
  }


  handleMsgChange(msg){
    this.setState((state)=>{
      msg = {...state.msgText,...msg};
      return {msgText:msg}
    },function(){
      this.props.handleContentConfig_msg(this.state.msgText)
    });
  };

  handleBarLinkChange(val){
    let barLinkConfig = {};
    if(typeof val === 'boolean'){
      barLinkConfig.openNew = val;
    }else if(typeof val === 'string'){
      barLinkConfig.url = val;
    }
    this.props.handleContentConfig_link(barLinkConfig);
  }

  render(){
    const {frShGl} = this.state;
    return (
      <Card Sectioned> 
        <SectionHead 
          handleToggle={(active) => this.setState({sectionActive:active})}
          headerTxt='Content configuration'
          sectionActive={this.state.sectionActive}
        />
        <Collapsible open={this.state.sectionActive} >
          <FormLayout>
            <NameField 
              handleName={(name)=> this.props.handleName(name)}
              name={this.props.name}
            />
            <FreeShippingGoal 
              handleGoalChange={this.handleGoalChange}
              goal={this.props.goal}
            />
            { frShGl? 
              <FormLayout>
                <InitialMsg goal={frShGl} currency="$" handleMsgChange={this.handleMsgChange} barTxt={this.props.barTxt}/>
                <ProgressMsg goal={frShGl} currency="$" handleMsgChange={this.handleMsgChange}  barTxt={this.props.barTxt}/>
              </FormLayout>
              :
              null
            }
            <GoalAchieved handleMsgChange={this.handleMsgChange}  barTxt={this.props.barTxt} />
            <AddLinkToBar handleBarLinkChange={this.handleBarLinkChange} link={this.props.link}/>
            <SetPosition handleBarPosition={(val)=>this.props.handleBarPosition(val)} barPosi={this.props.barPosi}/>
          </FormLayout>
        </Collapsible>
      </Card>
    )
  }
}

export default ContentConfigPage;