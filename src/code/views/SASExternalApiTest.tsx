import * as React from "react";
//import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";

//const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  showThis: boolean;
  firstName: string;
  lastName: string;
  headerText: string;
  isLoading: boolean;
  lastIndex: number;
  newsList: any;
}

export class SASExternalApiTest extends React.Component<{}, OwnState> {
  constructor(props = {}) {
    super(props);

    this.state = {
      showThis: true,
      firstName: "Richard",
      lastName: "Clowes",
      headerText: "Air Info",
      isLoading: false,
      lastIndex: 0,
      newsList: [],
    };
  }

  //this.handleClick = this.handleClick.bind(this);

  // api key aac4480daf03460fb800302e5b81a649

  componentDidMount() {
    const apiKey = "d126cacbbfebf7c84ad878e9deffc0e1";
    // let url: string =
    //   "https://newsapi.org/v2/top-headlines?country=us&apiKey=aac4480daf03460fb800302e5b81a649";

    let url: string =
      "https://api.openweathermap.org/data/2.5/weather?q=raleigh,us&APPID=${apiKey}";

    this.setState({
      isLoading: true,
    });
    console.log(`IsLoading=${this.state.isLoading}`);

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const news = result.map((item) => {
          item.newsId = this.state.lastIndex;
          item.isSelected = false;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({
          newsList: news,
          isLoading: false,
        });
        console.log(this.state.newsList);
        console.log(`IsLoading=${this.state.isLoading}`);
      })
      .catch((err) => {
        console.log("Error reading json file " + err);
      });
  }

  render(): JSX.Element {
    return <>Hello Karen</>;
  }
}
