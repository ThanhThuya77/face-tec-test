import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/lib/Modal';
import { Flex, Box, Button, Text } from 'rebass/styled-components';
import styled from 'styled-components';
import get from 'lodash/get';
import { ReactComponent as ErrorIcon } from 'assets/images/error.svg';
import { ReactComponent as TimeoutIcon } from 'assets/images/timeout.svg';
import { hideModal } from 'actions/index';
import { withModalTracker, withButtonTracker } from 'utils/withTracker';
import { MODAL_ID, BUTTON_ID, ERROR_CODES } from 'utils/constants';
import { Config } from '../../config';
import Theme from 'styles/theme';
import DOMPurify from 'dompurify';

export const StyledModal = styled(Modal)`
    .modal-dialog {
        margin: 170px auto 0 auto!important;
        ${({ theme }) => theme.mobile`
            margin: 30px auto!important;
        `}
    }
    .modal-content {
        overflow: hidden;
        border: none;
        background-color: white;
    }
    z-index: ${({ zIndex }) => zIndex || 1050};
`;

const StyledHeader = styled(Modal.Header)`
    padding: 30px 50px;
    border-bottom: none;
    background-color: ${({ theme }) => theme.colors.gray};
    display: flex;
    align-items: center;
    p {
        color: ${({ theme }) => theme.colors.white};
        font-size: 20px;
        line-height: 24px;
        font-weight: 300;
        margin: 0;
        ${({ theme }) => theme.mobile`
            line-height: unset;
            font-size: 14px;
            text-align: center;
            padding: 10px 0 0;
        `}
    }
    svg {
        min-width: 72px;
        height: 72px;
        margin-right: 20px;
        ${({ theme }) => theme.mobile`
            margin: auto;
        `}
    }
    ${({ theme }) => theme.mobile`
        flex-direction: column;
   `}
`;

const StyledBody = styled(Modal.Body)`
    padding: 30px 50px;
    min-height: 100px;
`;

const StyledFooter = styled(Modal.Footer)`
    padding: 30px 50px;
    border-top: none;
    text-align: left;
    ${({ theme }) => theme.mobile`
        text-align: center !important;
        padding: 20px 15px;
    `}
`;

export const StyledFlex = styled(Flex).attrs(() => ({
    flexDirection: ['column-reverse', 'row'],
    justifyContent: 'center',
}))``;

export const Redirect = styled.a`
    ${({ theme }) => theme.mobile`
        margin: auto;
    `}
`;

const CenterBox = styled(Box)`
    margin: auto;
    width: fit-content;
`;

const ErrorCode = styled(Text)`
    display: block;
    color: ${({ theme }) => theme.colors.red};
    margin-top: 12px;
`;

export const CloseButton = styled(Button)`
    ${({ theme }) => theme.solidButton}
    margin-top: 0px;
`;

export const ContinueButton = styled(Button)`
    ${({ theme }) => theme.contourButton}
    margin: 0 20px;
    ${({ theme }) => theme.mobile`
        margin-top: 20px;
    `}
`;

const ButtonTracking = styled(withButtonTracker(Button))`
    ${({ theme }) => theme.solidButton}
`;

export const generateMiwayModalFooter = (t) => (onHide) => (
    <Redirect href={Config.loginUrl}>
        <ButtonTracking id={BUTTON_ID.BACK_LOGIN} onClick={onHide} name="Back to login page">
            {t('insuranceMiway.modals.buttons.backToLoginPage')}
        </ButtonTracking>
    </Redirect>
);

export const getCommonModals = () => {
    return {
        DEFAULT: {
            header: "header",
            body: "body",
        },
    };
};

export const CommonModalContent = ({
    icon: Icon = ErrorIcon,
    header,
    body,
    footer = 'OK',
    hideErrorCode = false,
    errorCode,
    onHide,
}) => {
    return (
        <>
            <StyledHeader>
                <Icon />
                <Text as="p">{header}</Text>
            </StyledHeader>
            <StyledBody>
                <Text as="p" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body)}} />
                {!hideErrorCode && errorCode && (
                    <ErrorCode as="span">Error code: {errorCode}</ErrorCode>
                )}
            </StyledBody>
            <StyledFooter>
                {typeof footer === 'function' ? (
                    footer(onHide)
                ) : (
                    <CenterBox>
                        <Link to="/">
                            <CloseButton onClick={onHide}>{footer}</CloseButton>
                        </Link>
                    </CenterBox>
                )}
            </StyledFooter>
        </>
    );
};

export const AppModal = ({
    show,
    onHide,
    id,
    zIndex,
    allowHide = false,
    data,
    render,
    errorCode,
}) => {
    const cache = useRef({});

    const [commonModals, setCommonModal] = useState({});
    const RenderedComponent = render;
    const modalId = id || get(commonModals[errorCode], 'id') || MODAL_ID.ERROR_MODAL;

    useEffect(() => {
        setCommonModal(getCommonModals(t));
    }, [t]);

    const saveCache = (data) => {
        cache.current = { ...cache.current, ...data };
    };

    const getCache = (key) => (key ? cache.current[key] : cache.current);

    const hideModal = () => {
        if (allowHide) {
            onHide();
        }
    };

    const getModalContent = () => {
        if (!render) {
            const props = {
                ...(commonModals[modalId] || commonModals[errorCode] || commonModals.DEFAULT),
                errorCode,
                onHide,
            };
            return <CommonModalContent {...props} />;
        }
        if (typeof render === 'string') {
            return <Text as="p">{render}</Text>;
        }
        return (
            <RenderedComponent
                Header={StyledHeader}
                Body={StyledBody}
                Footer={StyledFooter}
                onHide={onHide}
                data={data}
                saveCache={saveCache}
                getCache={getCache}
                t={t}
            />
        );
    };

    return (
        <Theme>
            <StyledModal id={modalId} show={show} onHide={hideModal} zIndex={zIndex}>
                {getModalContent()}
            </StyledModal>
        </Theme>
    );
};

const mapStateToProps = ({
    modalState: {
        show,
        modal: { zIndex, tracking, trackingLabel, id, allowHide, data, render, errorCode },
    },
}) => ({
    show,
    zIndex,
    tracking,
    trackingLabel,
    id,
    allowHide,
    data,
    errorCode,
    render,
});

const mapDispatchToProp = {
    onHide: hideModal,
};

export default connect(mapStateToProps, mapDispatchToProp)(withModalTracker(AppModal));
