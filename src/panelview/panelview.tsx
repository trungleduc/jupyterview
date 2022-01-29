import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { JupyterViewDoc, JupyterViewDocChange } from '../mainview/model';
interface IProps {
  filePath?: string;
  sharedModel?: JupyterViewDoc;
}

interface IStates {
  panel1: boolean;
  panel2: boolean;
  panel3: boolean;
}
const panelTitleStyle = {
  background: 'var(--jp-layout-color2)',
  color: 'var(--jp-ui-font-color1)'
};
const panelBodyStyle = {
  color: 'var(--jp-ui-font-color1)',
  background: 'var(--jp-layout-color1)'
};
export default class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = { panel1: true, panel2: true, panel3: true };
    if(this.props.sharedModel){
      this.props.sharedModel.changed.connect(this.sharedModelChanged)
    }
  
  }

  componentWillUnmount(){
    console.log('called unmount');
    if(this.props.sharedModel){
      this.props.sharedModel.changed.connect(this.sharedModelChanged)
    }
  }
  
  componentDidUpdate(oldProps, oldState){
    console.log('connect ', this.props.sharedModel);
    if(oldProps.sharedModel){
      oldProps.sharedModel.changed.disconnect(this.sharedModelChanged)
    }
    if(this.props.sharedModel){
      this.props.sharedModel.changed.connect(this.sharedModelChanged)
      console.log('data', this.props.sharedModel.getContent('colorOption') );
      
    } 
  }
  
  
  private sharedModelChanged = (_, changed: JupyterViewDocChange) =>{
    console.log('changed', changed);
    
  }

  private togglePanel = (panel: 'panel1' | 'panel2' | 'panel3') => {
    this.setState(old => ({ ...old, [panel]: !old[panel] }));
  };
  render(): JSX.Element {
    return (
      <div className="jpview-control-panel">
        <div className="lm-Widget p-Widget jpview-control-panel-title">
          <h2>{this.props.filePath}</h2>
        </div>
        <Accordion expanded={this.state.panel1}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('panel1')}
          >
            <span className="lm-Widget">Accordion 1</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <span className="lm-Widget">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </span>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={this.state.panel2}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('panel2')}
          >
            <span>Accordion 2</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </span>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={this.state.panel3}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('panel3')}
          >
            <span>Disabled Accordion</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </span>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}
