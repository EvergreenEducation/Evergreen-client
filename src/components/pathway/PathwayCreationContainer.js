import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, notification } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import PathwayForm from 'components/pathway/PathwayForm';
import PathwayStore from 'store/Pathway';
import { reject, head, map, sortBy } from 'lodash';
import OfferStore from 'store/Offer';
import AuthService from 'services/AuthService';
import UploaderService from 'services/Uploader';
import useProviderDataFieldStore from 'components/provider/useProviderDataFieldStore';

configure({
  axios: axiosInstance,
});

const PathwayCreationContainer = ({ closeModal, role, providerId }) => {
  const { id: userId } = AuthService.currentSession;
  const formRef = useRef(null);
  const [file, setFile] = useState(null);
  const [groupsOfOffers, setGroupsOfOffers] = useState([]);
  const [form] = Form.useForm();
  const pathwayStore = PathwayStore.useContainer();
  const offerStore = OfferStore.useContainer();

  const onChangeUpload = (e) => {
    const { file } = e;
    if (file) {
      setFile(file);
    }
  };

  const [{ data: getDataFields }] = useAxios('/datafields');

  const [{ data: getOffers }] = useAxios('/offers');

  const [{ data: getProviders }] = useAxios('/providers');

  const [
    { data: postData, error: postError, response },
    createPathway,
  ] = useAxios(
    {
      url: '/pathways?scope=with_details',
      method: 'POST',
    },
    { manual: true }
  );

  const store = useProviderDataFieldStore();
  const { datafield: datafieldStore, provider: providerStore } = store;

  const submit = async () => {
    try {
      const values = await form.validateFields([
        'description',
        'learn_and_earn',
        'frequency',
        'frequency_unit',
        'name',
        'topics',
        'outlook',
        'earnings',
        'type',
        'keywords',
        'provider_id',
        'is_local_promo',
        'is_main_promo',
      ]);

      let groupOrderByYearNum = [];
      let groups_of_offers = map(groupsOfOffers, (g) => {
        groupOrderByYearNum.push(g.group_name);
        const results = {
          group_name: g.group_name,
          offer_ids: g.removed ? [] : map(g.offers, 'offer_id'),
        };
        const semester = form.getFieldValue(`${g.group_name}_semester`);

        if (semester) {
          return {
            ...results,
            semester,
          };
        }

        return results;
      });

      const groupOrder = await form.validateFields(groupOrderByYearNum);
      let yearSubmission = [];
      for (const key in groupOrder) {
        yearSubmission.push({
          group_name: key,
          year: groupOrder[key],
        });
      }

      yearSubmission = sortBy(yearSubmission, ['year']).map(
        ({ group_name }) => group_name
      );

      const response = await createPathway({
        data: {
          ...values,
          group_sort_order: yearSubmission,
          groups_of_offers,
        },
      });

      if (response.data && file && userId) {
        const { name, type } = file;
        const results = await UploaderService.upload({
          name,
          mime_type: type,
          uploaded_by_user_id: userId,
          fileable_type: 'pathway',
          fileable_id: response.data.id,
          binaryFile: file.originFileObj,
        });

        response.data.Files = [{ ...results.file.data }];

        pathwayStore.updateOne(response.data);

        if (results.success) {
          notification.success({
            message: 'Success',
            description: 'Image is uploaded',
          });
        }
      }

      if (response && response.status === 201) {
        form.resetFields();
        closeModal();
      }
    } catch (err) {
      console.error(err);
    }
  };
  let providerEntities = Object.values(providerStore.entities);

  useEffect(() => {
    if (formRef.current && role === 'provider') {
      providerEntities = reject(providerEntities, (p) => {
        return !(p.id === providerId);
      });

      form.setFieldsValue({
        provider_id: head(providerEntities).id,
      });
    }
    if (getDataFields) {
      datafieldStore.addMany(getDataFields);
    }
    if (postError) {
      const { status, statusText } = postError.request;
      notification.error({
        message: status,
        description: statusText,
      });
    }
    if (postData) {
      pathwayStore.addOne(postData);
    }
    if (response && response.status === 201) {
      notification.success({
        message: response.status,
        description: 'Successfully created pathway',
      });
    }
    if (getOffers) {
      offerStore.addMany(getOffers);
    }
    if (getProviders) {
      providerStore.addMany(getProviders);
    }
  }, [getDataFields, response, postError, getProviders, formRef]);

  return (
    <div>
      <Form form={form} ref={formRef}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '32rem' }}>
          <PathwayForm
            datafields={datafieldStore.entities}
            offers={Object.values(offerStore.entities)}
            groupsOfOffers={groupsOfOffers}
            setGroupsOfOffers={setGroupsOfOffers}
            userId={userId}
            onChangeUpload={onChangeUpload}
            file={file}
            providers={providerEntities}
            role={role}
            form={form}
          />
        </div>
        <section
          className="bg-white px-6 pt-5 pb-1 flex justify-center"
          style={{
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Button
            className="mr-3 px-10 rounded"
            type="primary"
            size="small"
            htmlType="submit"
            onClick={submit}
          >
            Create
          </Button>
          <Button
            className="px-10 rounded"
            size="small"
            type="dashed"
            onClick={() => closeModal()}
          >
            Cancel
          </Button>
        </section>
      </Form>
    </div>
  );
};

export default PathwayCreationContainer;
