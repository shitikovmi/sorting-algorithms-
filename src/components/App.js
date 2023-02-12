import Array from "./Array";
import Controls from "./Controls";
import styled from "styled-components";
import {Provider} from "react-redux";
import store from "../store";
import 'normalize.css';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #44475a;
    height: 100vh;
    padding: 0 15px;
    overflow: hidden;
  `

const App = () => (
    <Provider store={store}>
        <Wrapper>
            <Controls/>
            <Array/>
        </Wrapper>
    </Provider>
)

export default App;
