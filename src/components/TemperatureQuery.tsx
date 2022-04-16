import React, { ChangeEvent, Component } from 'react';


const DEFAULT_ERROR_STATE :ITemperatureQueryState = 
    {
        temperature : null,
        locations : [],
        locationToQuery : '',
        resolveLocation : false,
        loading : false
    }


export class TemperatureQuery extends Component<{}, ITemperatureQueryState> {
    static displayName = TemperatureQuery.name;
    
    state: ITemperatureQueryState;


    constructor(props: any) {
        super(props);
        this.state = 
        { 
            temperature : null,
            locations : [],
            locationToQuery : '',
            resolveLocation : false,
            loading : true
        };
    }

    renderLocationResolution(locations: IGeocodeForward[]) {
        
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Region</th>
                        <th>Country</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map(location =>
                        <tr key={location.label}>
                            <td>{location.name}</td>
                            <td>{location.region}</td>
                            <td>{location.country}</td>
                            <td><button className="btn btn-primary" onClick={() => this.handleTemperatureSubmit(location) }>Select</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    renderTemperatureDisplay(locations: ITemperature | null) {
        
        const location : IGeocodeForward = this.state.locations[0];

        return (
            <div>
                <label>The temperature in {location.name}, {location.region} is {locations?.degrees} degrees celcius</label>
            </div>
            
        );
    }


    render() {

        let headContent = this.state.loading || this.state.resolveLocation
            ? <p><em>Please enter a city name.</em></p> 
            : this.renderTemperatureDisplay(this.state.temperature); 

        let contents = this.state.resolveLocation
            ? this.renderLocationResolution(this.state.locations) 
            : <div></div>
        return (
            <div>
                <h1 id="tabelLabel" >Temperature query</h1>
                
                {headContent}

                <input type="text" 
                    value={this.state.locationToQuery} 
                    onChange={this.handleLocationChange} 
                    onKeyUp={this.handleLocationSubmit} />
                
                {contents}
            </div>
        );
    }

    handleLocationChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState(
            {
                temperature : this.state.temperature,
                locations : this.state.locations,
                locationToQuery : event.currentTarget.value,
                resolveLocation : this.state.resolveLocation,
                loading : this.state.loading
            }
        );
      }

    handleLocationSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key == "Enter")
        {
            try {
                const response: Response = await fetch(`API/GeocodeForwarding?location=${this.state.locationToQuery}`);
                const data : IGeocodeForward[] = (await response.json() as IGeocodeForward[]);
                
                if(data.length == 1)
                {
                    await this.handleTemperatureSubmit(data[0]);
                }
                else 
                {
                    this.setState(
                        { 
                            temperature : null,
                            locations : data,
                            locationToQuery : this.state.locationToQuery,
                            resolveLocation : true,
                            loading : false
                        });
                }
                
            } catch (e) {
                console.error(`Retrieval and deserialization of weatherforecast failed with exception ${e}`);
                this.setState(DEFAULT_ERROR_STATE);
            }
        }   
    }

    public async handleTemperatureSubmit(location : IGeocodeForward) {
        try {
            const response: Response = await fetch(`API/TemperatureForLocation?lat=${location.latitude}&lon=${location.longitude}`);
            const data : ITemperature = (await response.json() as ITemperature);
           
            this.setState(
                { 
                    temperature : data,
                    resolveLocation : false,
                    loading: false
                });
        } catch (e) {
            console.error(`Retrieval and deserialization of weatherforecast failed with exception ${e}`);
            this.setState(DEFAULT_ERROR_STATE);
        }
    }

    
    
}

export interface ITemperatureQueryState
{
    temperature: ITemperature | null,
    locations: IGeocodeForward[],
    locationToQuery: string,
    resolveLocation : boolean,
    loading: boolean
}

export interface ITemperature {
    degrees: number
}

export interface IGeocodeForward {
    
         latitude: number,
         longitude: number,
         label : string,
         name : string,
         type : string,
         number : string,
         street : string,
         postal_code : string,
         confidence: number,
         region : string,
         region_code : string,
         administrative_area : string,
         neighbourhood : string,
         country : string,
         country_code : string,
         map_url : string    

}