import Scrollbars from "react-custom-scrollbars-2"
import CrossIcon from '../assets/icons/cross.svg';
import LocalStorageKeys from '../local-storage/localStorageKeys.ts';

/**
 * Display information on an absolute panel displayed on top of the map.
 * @param {object} props
 * @param {CallableFunction} props.setInfoPanelDisplayed Callback to set hide or display this information panel.
 */
const InformationPanel = ({ setInfoPanelDisplayed }) => {
    const closeInfoPanel = () => {
        setInfoPanelDisplayed(false);
        localStorage.setItem(LocalStorageKeys.IS_INFO_PANEL_HIDDEN, 'true');
    }

    return (
        <section className='information-panel'>
            <Scrollbars autoHeight autoHeightMax={'100%'} renderTrackHorizontal={props => <div {...props} style={{display: 'none'}} className="track-horizontal"/>}>
                <div className='information-panel-title-wrapper'>
                    <h2>Welcome to the <span className='blue-text'>Nominatim QA</span> Tool!</h2>
                    <div className='flex-one'></div>
                    <button className='information-panel-close-button' onClick={closeInfoPanel}>
                        <img src={CrossIcon} alt='close icon' className="information-panel-close-icon"/>
                    </button>
                </div>
                <p>
                    This tool helps to improve the OpenStreetMap data quality by extracting suspect data from the <a href='https://nominatim.org/' target='_blank' rel="noreferrer">Nominatim</a> database. You can contribute to the development of this tool through the <a href='https://github.com/AntoJvlt/Nominatim-Data-Analyser' target='_blank' rel="noreferrer">github repository</a>.
                </p>
                <p>
                    The suspect data is distributed over multiple layers. You can find these layers in the menu on the left of your screen. Feel free to check the data and to correct it if you live nearby!
                </p>
                <p>
                    We do not have a "report false positive" feature implemented yet. If you find a lot of data which should not be considered as errors, please come to the "Issues" section of the <a href='https://github.com/AntoJvlt/Nominatim-Data-Analyser/issues' target='_blank' rel="noreferrer">github repository</a> to discuss this.
                </p>
                <p className='italic-text'>
                    /!\ You might encounter some performance issues with some layers if you are using the Firefox browser. Please switch to another browser if this is the case. /!\
                </p>
            </Scrollbars>
        </section>
    )
}

export default InformationPanel
