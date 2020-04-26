import classNames from "classnames";
import * as React from "react";

import {
  Button,
  Classes,
  H5,
  HTMLSelect,
  Intent,
  IToasterProps,
  IToastProps,
  Label,
  NumericInput,
  Position,
  ProgressBar,
  Switch,
  Toaster,
  IToaster,
  ToasterPosition,
} from "@blueprintjs/core";

type IToastDemo = IToastProps & { button: string };

const POSITIONS = [
  Position.TOP_LEFT,
  Position.TOP,
  Position.TOP_RIGHT,
  Position.BOTTOM_LEFT,
  Position.BOTTOM,
  Position.BOTTOM_RIGHT,
];

interface PropsInterface {
  open: boolean;
  value: number;
}

export default class ProgressNotification extends React.Component<
  PropsInterface,
  IToasterProps
> {
  private appToaster: IToaster
  private key :string
  constructor(props) {
    super(props);
    this.state = {
      autoFocus: false,
      canEscapeKeyClear: true,
      position: Position.TOP_RIGHT,
    };
    this.appToaster = Toaster.create(this.state);
  }

  componentDidUpdate(prevProps: PropsInterface, prevState: IToasterProps) {
    if (prevProps.open !== this.props.open || prevProps.value !== this.props.value) {
      if (this.props.open) {
        if (this.key) {
          this.appToaster.show(this.renderProgress(), this.key)
        } else {
          this.key = this.appToaster.show(this.renderProgress())
        }
      }
    }
  }

  render() {
    return <div />;
  }

  renderProgress(): IToastProps {
    const amount = this.props.value;
    return {
      // className: this.props.data.themeName,
      icon: "cloud-download",
      message: (
        <ProgressBar
          className={classNames("docs-toast-progress", {
            [Classes.PROGRESS_NO_STRIPES]: amount >= 100,
          })}
          intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
          value={amount / 100}
        />
      ),
      onDismiss: (didTimeoutExpire: boolean) => {},
      timeout: amount < 100 ? 0 : 500,
    };
  }
}
