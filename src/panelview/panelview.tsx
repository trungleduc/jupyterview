import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface IProps {}

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
  }

  render(): JSX.Element {
    return (
      <div className="jpview-control-panel">
        <div className="lm-Widget p-Widget jpview-control-panel-title">
          <h2>File name</h2>
        </div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={panelTitleStyle}
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
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={panelTitleStyle}
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
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
            sx={panelTitleStyle}
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
