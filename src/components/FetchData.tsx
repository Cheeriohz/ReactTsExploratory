import React, { Component } from 'react';

export class FetchData extends Component<{}, IForcecastFetchState> {
    static displayName = FetchData.name;

    state: IForcecastFetchState;


    constructor(props: any) {
        super(props);
        this.state = { forecasts: [], loading: true };
    }

    public componentDidMount() {
        this.populateWeatherData();
    }

    static renderForecastsTable(forecasts: IForecast[]) {
        const convertISOStringToMonthDay = (date: string) => {
            const tempDate = new Date(date).toString().split(' ');
            const formattedDate = `${tempDate[1]} ${+tempDate[2]}`;
            return formattedDate;
        };

        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{convertISOStringToMonthDay(forecast.date)}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.renderForecastsTable(this.state.forecasts);

        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        try {
            const response: Response = await fetch('API/weatherforecast');
            const data = await response.json();
            this.setState({ forecasts: data, loading: false });
        } catch (e) {
            console.error(`Retrieval and deserialization of weatherforecast failed with exception ${e}`);
            this.setState({ forecasts: [], loading: false });
        }
    }

    

}

export interface IForcecastFetchState
{
    forecasts: IForecast[],
    loading: boolean
}

export interface IForecast {
    date : string,
    temperatureC : string,
    temperatureF : string,
    summary : string

}