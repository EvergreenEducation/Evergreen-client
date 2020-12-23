import React, { } from 'react';
import { Button, Popconfirm } from 'antd';
import { last, findIndex } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import axiosInstance from 'services/AxiosInstance';
import useGlobalStore from 'store/GlobalStore';
import  { configure } from 'axios-hooks';
import './promote-card.scss';

const axios = require('axios').default;

configure({
  axios: axiosInstance,
});

export default function ({ data = {}, session, activePageId, type, allApiCall }) {
  const { provider, offer, pathway } = useGlobalStore();
  const adminId = session.id;

  const update = async (data, endpoint, value, container, updateType) => {
    let {id,custom_page_promo_ids,custom_page_local_ids}=data;
    if (!id || !endpoint || !value) {
      return;
    }
    // console.log('daaaaaata', value);
    // let type = endpoint === "offers" ? "offer" : endpoint === "providers" ? "provider" : endpoint === "pathways" ? "pathway" : null,
    //   user_id = id,
    //   custom_page_promo_ids = value.is_main_promo === undefined ? null : value.is_main_promo === true || value.is_main_promo === false ? value.custom_page_promo_ids.length ? value.custom_page_promo_ids[0] : null : null,
    //   custom_page_local_ids = value.is_local_promo === undefined ? null : value.is_local_promo === true || value.is_local_promo === false ? value.custom_page_local_ids.length ? value.custom_page_local_ids[0] : null : null,
    //   custom_page_promo_routes = uniqueArray(value.custom_page_promo_routes);

    let type = endpoint === "offers" ? "offer" : endpoint === "providers" ? "provider" : endpoint === "pathways" ? "pathway" : null,
      user_id = id,
      promo_ids = value.is_main_promo === undefined ? null : value.is_main_promo === true || value.is_main_promo === false ? value.id : null,
      local_ids = value.is_local_promo === undefined ? null : value.is_local_promo === true || value.is_local_promo === false ? value.id : null,
      custom_page_promo_routes = value.page_route === undefined ? null : value.page_route,
      is_main_promo=custom_page_promo_ids?custom_page_promo_ids.length?custom_page_promo_ids.includes(value.id):false :false,
      is_local_promo=custom_page_local_ids?custom_page_local_ids.length?custom_page_local_ids.includes(value.id):false :false;

    if (updateType === 'reset') {
      let data = value;
      const response = await axiosInstance.put(
        `/${endpoint}/${id}?scope=with_files`,
        data
      );
      await container.updateOne(response.data);
      
      let promo=[],local=[],route=[];
      promo.push(promo_ids)
      local.push(local_ids)
      route.push(custom_page_promo_routes)
      // console.log(promo,local,route,'promo_ids,local_ids,custom_page_promo_routes')
      deletePromotionSetting(type, user_id, promo,local,route);
      return response;
    } else if (updateType === 'local') {
      if (is_local_promo === false ||is_local_promo === true) {
        let data = {
          is_local_promo: value.is_local_promo,
          local_promoted_by_user_ids: value.local_promoted_by_user_ids
        }
        const response = await axiosInstance.put(
          `/${endpoint}/${id}?scope=with_files`,
          data
        );
        await container.updateOne(response.data);
        if (!is_local_promo === false) {
          let promo=[],local=[],route=[];
          promo.push(promo_ids)
          local.push(local_ids)
          route.push(custom_page_promo_routes)
          // console.log(promo,local,route,'promo_ids,local_ids,custom_page_promo_routes')
          deletePromotionSetting(type, user_id, promo,local,route);
          // deletePromotionSetting(type, user_id, promo_ids, local_ids, custom_page_promo_routes);
        } else {
          updatePromotionSetting(type, user_id, promo_ids, local_ids, custom_page_promo_routes);
        }
        return response;
      }
    } else if (updateType === 'main') {
      if ( is_main_promo === false || is_main_promo === true) {
        let data = {
          is_main_promo: value.is_main_promo,
          main_promoted_by_user_ids: value.main_promoted_by_user_ids
        }
        const response = await axiosInstance.put(
          `/${endpoint}/${id}?scope=with_files`,
          data
        );
        await container.updateOne(response.data);
        if (!is_main_promo === false) {
          let promo=[],local=[],route=[];
          promo.push(promo_ids)
          local.push(local_ids)
          route.push(custom_page_promo_routes)
          // console.log(promo,local,route,'promo_ids,local_ids,custom_page_promo_routes')
          deletePromotionSetting(type, user_id, promo,local,route);
          // deletePromotionSetting(type, user_id, promo_ids, local_ids, custom_page_promo_routes);
        } else {
          updatePromotionSetting(type, user_id, promo_ids, local_ids, custom_page_promo_routes);
        }
        return response;
      }
    } else {

    }
  };

  function uniqueArray(idArray) {
    idArray = idArray.filter(function (item, index, inputArray) {
      if (item === null || item === undefined) {
        return false
      } else {
        return inputArray.indexOf(item) == index;
      }
    });
    return idArray
  }

  const removeAdminId = (nameOfUserIdArr, userIdsArr, incomingPromoData) => {
    const foundAdminIndex = findIndex(userIdsArr, function (item) {
      return item === adminId;
    });
    const newMainPromotedByUserIds = userIdsArr;
    newMainPromotedByUserIds.splice(foundAdminIndex, 1);
    return {
      ...incomingPromoData,
      [nameOfUserIdArr]: newMainPromotedByUserIds,
    };
  };

  const includeAdminId = (promoData, nameOfUserIdArr, userIdArr) => {
    if (userIdArr) {
      const newObj = {
        ...promoData,
        [nameOfUserIdArr]: [...userIdArr, adminId],
      };
      return newObj;
    }
  };

  function togglePromo(data, promoType) {
    const {
      is_local_promo,
      entity_type,
      is_main_promo,
      local_promoted_by_user_ids,
      main_promoted_by_user_ids,
      custom_page_promo_ids,
      custom_page_local_ids
    } = data;
    let localPromoData = { is_local_promo: !is_local_promo };
    let mainPromoData = { is_main_promo: !is_main_promo };
    const resetPromoData = {
      is_main_promo: false,
      is_local_promo: false,
      local_promoted_by_user_ids: [],
      main_promoted_by_user_ids: [],
    }, 
    idLocalArray = [], routeArray = [], promoIdArray = [];

    if (entity_type === 'offer') {
      if (promoType === 'local') {
        if (custom_page_local_ids) {
          if (!custom_page_local_ids.includes(activePageId.id)) {
            localPromoData = includeAdminId(
              localPromoData,
              'local_promoted_by_user_ids',
              local_promoted_by_user_ids
            );
          } else {
            localPromoData = removeAdminId(
              'local_promoted_by_user_ids',
              local_promoted_by_user_ids,
              localPromoData
            );
          }
          // if (localPromoData) {
          //   idLocalArray.push(activePageId.id);
          //   routeArray.push(activePageId.page_route);
          //   localPromoData.custom_page_local_ids = idLocalArray;
          //   localPromoData.custom_page_promo_routes = routeArray;
          // }

          localPromoData.id = activePageId.id;
          localPromoData.page_route = activePageId.page_route;
          return update(data, 'offers', localPromoData, offer, 'local');
        }
      }
      if (promoType === 'main') {
        if (custom_page_promo_ids) {
          if (!custom_page_promo_ids.includes(activePageId.id)) {
            mainPromoData = includeAdminId(
              mainPromoData,
              'main_promoted_by_user_ids',
              main_promoted_by_user_ids
            );
          } else {
            mainPromoData = removeAdminId(
              'main_promoted_by_user_ids',
              main_promoted_by_user_ids,
              mainPromoData
            );
          }
          // if (mainPromoData) {
          //   promoIdArray.push(activePageId.id);
          //   routeArray.push(activePageId.page_route);
          //   mainPromoData.custom_page_promo_ids = promoIdArray;
          //   mainPromoData.custom_page_promo_routes = routeArray;
          // }
          mainPromoData.id = activePageId.id;
          mainPromoData.page_route = activePageId.page_route;
          return update(data, 'offers', mainPromoData, offer, 'main');
        }
      }
      resetPromoData.id = activePageId.id;
      resetPromoData.page_route = activePageId.page_route;
      return update(data, 'offers', resetPromoData, offer, 'reset');
    }
    if (entity_type === 'provider') {
      if (promoType === 'local') {
        if (custom_page_local_ids) {
          if (!custom_page_local_ids.includes(activePageId.id)) {
            localPromoData = includeAdminId(
              localPromoData,
              'local_promoted_by_user_ids',
              local_promoted_by_user_ids
            );
          } else {
            localPromoData = removeAdminId(
              'local_promoted_by_user_ids',
              local_promoted_by_user_ids,
              localPromoData
            );
          }
          // if (localPromoData) {
          //   idLocalArray.push(activePageId.id);
          //   routeArray.push(activePageId.page_route);
          //   localPromoData.custom_page_local_ids = idLocalArray;
          //   localPromoData.custom_page_promo_routes = routeArray; 
          // }
          localPromoData.id = activePageId.id;
          localPromoData.page_route = activePageId.page_route;
          return update(data, 'providers', localPromoData, provider, 'local');
        }
      }
      if (promoType === 'main') {
        if (custom_page_promo_ids) {
          if (!custom_page_promo_ids.includes(activePageId.id)) {
            mainPromoData = includeAdminId(
              mainPromoData,
              'main_promoted_by_user_ids',
              main_promoted_by_user_ids
            );
          } else {
            mainPromoData = removeAdminId(
              'main_promoted_by_user_ids',
              main_promoted_by_user_ids,
              mainPromoData
            );
          }
          // if (mainPromoData) {
          //   promoIdArray.push(activePageId.id);
          //   routeArray.push(activePageId.page_route);
          //   mainPromoData.custom_page_promo_ids = promoIdArray;
          //   mainPromoData.custom_page_promo_routes = routeArray;       
          // }
          mainPromoData.id = activePageId.id;
          mainPromoData.page_route = activePageId.page_route;
          return update(data, 'providers', mainPromoData, provider, 'main');
        }
      }
      resetPromoData.id = activePageId.id;
      resetPromoData.page_route = activePageId.page_route;
      return update(data, 'providers', resetPromoData, provider, 'reset');
    }
    if (entity_type === 'pathway') {
      if (promoType === 'local') {
        if (custom_page_local_ids) {
          if (!custom_page_local_ids.includes(activePageId.id)) {
            localPromoData = includeAdminId(
              localPromoData,
              'local_promoted_by_user_ids',
              local_promoted_by_user_ids
            );
          } else {
            localPromoData = removeAdminId(
              'local_promoted_by_user_ids',
              local_promoted_by_user_ids,
              localPromoData
            );
          }
          // if (localPromoData) {
          //   idLocalArray.push(activePageId.id);
          //   routeArray.push(activePageId.page_route);
          //   localPromoData.custom_page_local_ids = idLocalArray;
          //   localPromoData.custom_page_promo_routes = routeArray;

          // }
          localPromoData.id = activePageId.id;
          localPromoData.page_route = activePageId.page_route;
          return update(data, 'pathways', localPromoData, pathway, 'local');
        }
      }
      if (promoType === 'main') {
        if (custom_page_promo_ids) {
          if (!custom_page_promo_ids.includes(activePageId.id)) {
            mainPromoData = includeAdminId(
              mainPromoData,
              'main_promoted_by_user_ids',
              main_promoted_by_user_ids
            );
          } else {
            mainPromoData = removeAdminId(
              'main_promoted_by_user_ids',
              main_promoted_by_user_ids,
              mainPromoData
            );
          }
          // if (mainPromoData) {
          //   promoIdArray.push(activePageId.id);
          //   routeArray.push(activePageId.page_route);
          //   mainPromoData.custom_page_promo_ids = promoIdArray;
          //   mainPromoData.custom_page_promo_routes = routeArray;
          // }
          mainPromoData.id = activePageId.id;
          mainPromoData.page_route = activePageId.page_route;
          return update(data, 'pathways', mainPromoData, pathway, 'main');
        }
      }
      resetPromoData.id = activePageId.id;
      resetPromoData.page_route = activePageId.page_route;
      return update(data, 'pathways', resetPromoData, pathway, 'reset');
    }
    return;
  }

  function confirm(e) {
    togglePromo(data);
  }

  let themeBorder = 'promote-card--offerBorder', themeBackground = 'promote-card--offerBg';

  if (data && data.entity_type === 'provider') {
    themeBorder = 'promote-card--providerBorder';
    themeBackground = 'promote-card--providerBg';
  }

  if (data && data.entity_type === 'pathway') {
    themeBorder = 'promote-card--pathwayBorder';
    themeBackground = 'promote-card--pathwayBg';
  }

  // update promo route api
  const updatePromoRoute = async (type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes) => {
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/update_promo_route`, {
      type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes
    })
    return Data
  }
  // calling update promotion setting
  const updatePromotionSetting = (type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes) => {
    updatePromoRoute(type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes).then(res => {
      // console.log('updatePromotionSetting res', res.data)
      allApiCall();
    }).catch(err => {
      console.log('updatePromoRoute err', err)
    })
  }
  // calling delete promotion setting
  const deletePromotionSetting = (type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes) => {
    deletePromoRoute(type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes).then(res => {
      // console.log('deletePromoRoute res', res.data)
      allApiCall();
    }).catch(err => {
      console.log('updatePromoRoute err', err)
    })
  }
  // delete promo route
  const deletePromoRoute = async (type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes) => {
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/delete_promo_route`, {
      type, user_id, custom_page_promo_ids, custom_page_local_ids, custom_page_promo_routes
    })
    return Data
  }


  let { custom_page_promo_ids, custom_page_local_ids } = data,
    mainArray = custom_page_promo_ids === undefined || custom_page_promo_ids === null ? [] : uniqueArray(custom_page_promo_ids),
    localArray = custom_page_local_ids === undefined || custom_page_local_ids === null ? [] : uniqueArray(custom_page_local_ids),
    isLocalSelected = localArray.includes(activePageId.id),
    isMainSelected = mainArray.includes(activePageId.id);
  // console.log('type', type, '\n activePageId', activePageId)
  return (
    <React.Fragment>
      <div className={`promote-card h-auto w-48 mr-3 mb-3 rounded border border-solid ${themeBorder} shadow`}>
        <header className={`py-1 px-2 text-center capitalize ${themeBackground}`}
          style={{
            borderTopRightRadius: '0.20rem',
            borderTopLeftRadius: '0.20rem',
          }}>
          {data && data.entity_type ? data.entity_type : ''}
        </header>
        <figure className="block bg-gray-200">
          {(data && data.Files && data.Files.length && (
            <img
              className="object-cover mx-auto"
              style={{ height: 112 }}
              src={
                data.Files && data.Files.length
                  ? last(data.Files).file_link
                  : null
              } alt="" />
          )) || (
              <div className="mx-auto p-6">
                <FontAwesomeIcon
                  className="text-6xl text-gray-400 mx-auto block"
                  icon={faImage} />
              </div>
            )}
        </figure>
        <div className="flex flex-col pb-2 px-2">
          <span className="text-base break-all">{data && data.name ? data.name : '---'}</span>
          <footer>
            <Button size="small"
              className={`mr-1 rounded text-white border-none promote-card__toggleBtn promote-card__toggleBtn--main ${
                mainArray.includes(activePageId.id)
                  ? 'promote-card--toggledMain shadow-inner'
                  : 'promote-card--notToggled shadow-md'
                }`}
              onClick={() => {
                if (data) {
                  togglePromo(data, 'main');
                }
              }}>main</Button>
            <Button size="small"
              className={`rounded text-white border-none promote-card__toggleBtn promote-card__toggleBtn--local ${
                localArray.includes(activePageId.id)
                  ? 'promote-card--toggledLocal shadow-inner'
                  : 'promote-card--notToggled shadow-md'
                }`}
              onClick={() => {
                if (data) {
                  togglePromo(data, 'local');
                }
              }}>local</Button>
            <Popconfirm title="Are you sure?" onConfirm={confirm} okText="Yes" cancelText="No">
              <Button type="link" size="small" danger>reset</Button>
            </Popconfirm>
          </footer>
        </div>
      </div>
      {/* {
        type === "selected" || isLocalSelected || isMainSelected ?
        <div className={`promote-card h-auto w-48 mr-3 mb-3 rounded border border-solid ${themeBorder} shadow`}>
          <header className={`py-1 px-2 text-center capitalize ${themeBackground}`}
            style={{
              borderTopRightRadius: '0.20rem',
              borderTopLeftRadius: '0.20rem',
            }}
          >
            {data && data.entity_type ? data.entity_type : ''}
          </header>
          <figure className="block bg-gray-200">
            {(data && data.Files && data.Files.length && (
              <img
                className="object-cover mx-auto"
                style={{ height: 112 }}
                src={
                  data.Files && data.Files.length
                    ? last(data.Files).file_link
                    : null
                }
                alt=""
              />
            )) || (
                <div className="mx-auto p-6">
                  <FontAwesomeIcon className="text-6xl text-gray-400 mx-auto block" icon={faImage}/>
                </div>
              )}
          </figure>
          <div className="flex flex-col pb-2 px-2">
            <span className="text-base break-all">
              {data && data.name ? data.name : '---'}
            </span>
            <footer>
              <Button size="small"
                className={`mr-1 rounded text-white border-none promote-card__toggleBtn promote-card__toggleBtn--main ${
                  mainArray.includes(activePageId.id)
                    ? 'promote-card--toggledMain shadow-inner'
                    : 'promote-card--notToggled shadow-md'
                  }`}
                onClick={() => {
                  if (data) {
                    togglePromo(data, 'main');
                  }}}>main</Button>
              <Button size="small"
                className={`rounded text-white border-none promote-card__toggleBtn promote-card__toggleBtn--local ${
                  localArray.includes(activePageId.id)
                    ? 'promote-card--toggledLocal shadow-inner'
                    : 'promote-card--notToggled shadow-md'
                  }`}
                onClick={() => {
                  if (data) {
                    togglePromo(data, 'local');
                  }}}>local</Button>
              <Popconfirm title="Are you sure?" onConfirm={confirm} okText="Yes" cancelText="No">
                <Button type="link" size="small" danger>reset</Button>
              </Popconfirm>
            </footer>
          </div>
        </div> 
        :
         <div className={`promote-card h-auto w-48 mr-3 mb-3 rounded border border-solid ${themeBorder} shadow`}>
            <header className={`py-1 px-2 text-center capitalize ${themeBackground}`}
              style={{
                borderTopRightRadius: '0.20rem',
                borderTopLeftRadius: '0.20rem',
              }}>
              {data && data.entity_type ? data.entity_type : ''}
            </header>
            <figure className="block bg-gray-200">
              {(data && data.Files && data.Files.length && (
                <img
                  className="object-cover mx-auto"
                  style={{ height: 112 }}
                  src={
                    data.Files && data.Files.length
                      ? last(data.Files).file_link
                      : null
                  } alt=""/>
              )) || (
                  <div className="mx-auto p-6">
                    <FontAwesomeIcon
                      className="text-6xl text-gray-400 mx-auto block"
                      icon={faImage}/>
                  </div>
                )}
            </figure>
            <div className="flex flex-col pb-2 px-2">
              <span className="text-base break-all">{data && data.name ? data.name : '---'}</span>
              <footer>
                <Button size="small"
                  className={`mr-1 rounded text-white border-none promote-card__toggleBtn promote-card__toggleBtn--main ${
                    mainArray.includes(activePageId.id)
                      ? 'promote-card--toggledMain shadow-inner'
                      : 'promote-card--notToggled shadow-md'
                    }`}
                  onClick={() => {
                    if (data) {
                      togglePromo(data, 'main');
                    }
                  }}>main</Button>
                <Button size="small"
                  className={`rounded text-white border-none promote-card__toggleBtn promote-card__toggleBtn--local ${
                    localArray.includes(activePageId.id)
                      ? 'promote-card--toggledLocal shadow-inner'
                      : 'promote-card--notToggled shadow-md'
                    }`}
                  onClick={() => {
                    if (data) {
                      togglePromo(data, 'local');
                    }
                  }}>local</Button>
                <Popconfirm title="Are you sure?" onConfirm={confirm} okText="Yes" cancelText="No">
                  <Button type="link" size="small" danger>reset</Button>
                </Popconfirm>
              </footer>
            </div>
          </div>
      } */}
    </React.Fragment>
  );
}