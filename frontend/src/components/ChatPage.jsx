import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Container, Row, Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import fetchData from '../store/slices/fetchData';
import Channels from './Channels/Channels';
import Messages from './Messages/Messages';
import useAuth from '../hooks/useAuth.hook.js';
import getModal from './modals/index';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.channels);
  const modalType = useSelector((state) => state.modals.modalType);

  const { getAuthHeaders, logOut } = useAuth();
  const { t } = useTranslation();

  const renderModal = (type) => {
    if (!type) {
      return null;
    }
    const Modal = getModal(type);
    return <Modal />;
  };

  useEffect(() => {
    const getData = async () => {
      const headers = getAuthHeaders();
      dispatch(fetchData(headers))
        .unwrap()
        .catch((e) => {
          if (!e.isAxiosError) {
            toast.error(t('errors.unknown'));
            return;
          }
          if (e.isAxiosError) {
            toast.error(t('errors.network'));
          }
          if (e.status === 401) {
            logOut();
          }
        });
    };
    getData();
  }, [dispatch, getAuthHeaders, logOut, t]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner
          animation="border"
          variant="primary"
          role="status"
          style={{ width: '5rem', height: '5rem' }}
          className="justify-self-center lg"
        />
      </div>
    );
  }
  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="row h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <Channels />
        </Col>
        <Col className="col p-0 h-100">
          <Messages />
        </Col>
      </Row>
      {renderModal(modalType)}
    </Container>
  );
};

export default ChatPage;
