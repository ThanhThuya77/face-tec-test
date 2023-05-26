import React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'rebass/styled-components';
import { ReactComponent as LoadingIcon } from '../../assets/images/loading.svg';

const Wrapper = styled(Box).attrs(({zIndex}) => ({
    zIndex: zIndex || 9999
}))`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
`;

const Overlay = styled(Box)`
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.5;
`;

const Icon = styled(LoadingIcon)`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 63px;
    height: 63px;
`;

const LoadingText = styled(Text).attrs(() => ({
    fontSize: [14, 20],
    lineHeight: [18, 28],
}))`
    p {
        text-align: center;
        position: absolute;
        top: 180px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        height: 100px;
        color: white;
    }
`;

const Loading = ({ loadingText }) => {
    return (
        <Wrapper>
            <Overlay />
            <Icon />
            {loadingText && <LoadingText>{loadingText}</LoadingText>}
        </Wrapper>
    );
};

export default Loading;
