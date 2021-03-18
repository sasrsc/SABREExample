import * as React from "react";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Input } from "../../components/Input";
import { Payload } from "../../components/Payload";
import { PopoverForm } from "../../components/PopoverForm";
import { PopoverFormSAS } from "../../components/PopoverFormSAS";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { Variables } from "../../services/Variables";
import { Table } from "react-bootstrap";
import * as moment from "moment";

export interface CommandServicePopoverProps {
  handleClose?: () => void;
  navigation?: JSX.Element;
}

export interface CommandServicePopoverState {
  formatToExecute: string;
  showRq: boolean;
  showRs: boolean;
  cmdResponse: any;
  loading: any;
}
export class IntroPopover extends React.Component<
  CommandServicePopoverProps,
  CommandServicePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
    this.handleRefreshLoad = this.handleRefreshLoad.bind(this);
  }

  state: CommandServicePopoverState = {
    formatToExecute: "",
    showRq: true,
    showRs: true,
    cmdResponse: null,
    loading: [],
  };

  componentDidMount() {
    let uploads = getService(Variables).getGlobal("uploads");
    console.log(uploads);
    if (uploads.length > 0) {
      console.log(`${uploads.length} items in the array`);

      const newArray = uploads.map((i) =>
        i.filename !== ""
          ? {
              ...i,
              aging: moment(i.refreshed).fromNow(),
              lastload: moment(i.refreshed).toString(),
            }
          : i
      );
      console.log(newArray);
      newArray.sort(function (a, b) {
        return b.refreshed - a.refreshed;
      });

      //loop through the array and add another property for each
      // uploads.aging = moment(uploads.refreshed).fromNow();
      // uploads.lastload = moment(uploads.refreshed).toString();
      // uploads.isLoadedStr = uploads.isloaded.toString();
      this.setState({ loading: newArray });
    } else {
      console.log(`The uploads array is empty`);
    }
  }
  handleChange(e): void {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleCheck(e): void {
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }
  handleExecute(): void {
    getService(CommFoundHelper)
      .sendCommandMessage(
        this.state.formatToExecute,
        this.state.showRq,
        this.state.showRs
      )
      .then((res) => {
        if (this.state.showRs || this.state.showRs) {
          this.props.handleClose();
        } else {
          this.setState({ cmdResponse: res });
        }
      });
  }

  handleRefreshLoad = (file: string, objName: string) => (e) => {
    // refresh the file
    getService(CommFoundHelper).getGlobalVariable(file, objName);
    this.props.handleClose();
  };

  renderButtons(): JSX.Element[] {
    return [
      <Button
        name="btnCancel"
        type="cancel"
        title="Close"
        handleClick={this.props.handleClose}
      />,
    ];
  }

  render(): JSX.Element {
    return (
      <>
        <PopoverFormSAS
          name=""
          title="SAS Intro"
          content={null}
          buttons={this.renderButtons()}
          navigation={this.props.navigation}
        >
          <h2>Welcome to the SAS WebApp for SABRE....</h2>
          <p>
            This is a more modern, improved version of the SABRE Scripts that
            Nancy has so perfected over the years.
          </p>
          <ul>
            <li>
              <a
                href="https://sasoffice365.sharepoint.com/sites/CorporateTravelUSPrivate"
                target="_blank"
              >
                TAS Eyes Only
              </a>
            </li>
            <li>
              <a
                href="https://sasoffice365.sharepoint.com/sites/CorporateTravelUSPrivate/SitePages/International-Travel-Review.aspx"
                target="_blank"
              >
                COVID-19 Travel Review - Agent Help
              </a>
            </li>
            <li>
              <a
                href="http://sww.sas.com/sww-bin/broker94?_service=appprod94&_program=tasprod.nonref_main.sas"
                target="_blank"
              >
                Non Ref
              </a>
            </li>
            <li>
              <a
                href="http://sww.sas.com/sww-bin/broker94?_service=appprod94&_program=tasprod.passport_main.sas"
                target="_blank"
              >
                Passport
              </a>
            </li>
          </ul>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>File Name</th>
                <th>Date/Time</th>
                <th>Count</th>
                <th>Live</th>
                <th>Sucess</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.loading.map((s) => (
                <tr key={s.filename}>
                  <td>{s.objName}</td>
                  <td>{s.filename}</td>
                  <td>{s.lastload}</td>
                  <td className="rightContent">{s.count.toLocaleString()}</td>
                  <td>{s.aging}</td>
                  <td className="centerContent">
                    {s.isLoaded ? (
                      <span className="fa fa-check green"> </span>
                    ) : (
                      <span className="fa fa-times red"> </span>
                    )}
                  </td>
                  <td className="centerContent">
                    <span
                      onClick={this.handleRefreshLoad(s.filename, s.objName)}
                      className="fa fa-sync"
                    ></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </PopoverFormSAS>
      </>
    );
  }
}
