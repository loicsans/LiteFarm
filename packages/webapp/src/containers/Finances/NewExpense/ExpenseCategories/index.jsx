import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import styles from './styles.module.scss';
import { expenseTypeTileContentsSelector } from '../../selectors';
import { ReactComponent as EquipIcon } from '../../../../assets/images/log/equipment.svg';
import { ReactComponent as SoilAmendmentIcon } from '../../../../assets/images/log/fertilizing.svg';
import { ReactComponent as PestIcon } from '../../../../assets/images/log/bug.svg';
import { ReactComponent as FuelIcon } from '../../../../assets/images/log/fuel.svg';
import { ReactComponent as MachineIcon } from '../../../../assets/images/log/machinery.svg';
import { ReactComponent as SeedIcon } from '../../../../assets/images/log/seeding.svg';
import { ReactComponent as OtherIcon } from '../../../../assets/images/log/other.svg';
import { ReactComponent as LandIcon } from '../../../../assets/images/log/land.svg';
import { setSelectedExpenseTypes } from '../../actions';
import history from '../../../../history';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ManageCustomExpenseTypesSpotlight from '../ManageCustomExpenseTypesSpotlight';
import PureFinanceTypeSelection from '../../../../components/Finances/PureFinanceTypeSelection';
import { HookFormPersistProvider } from '../../../hooks/useHookFormPersist/HookFormPersistProvider';

export const icons = {
  EQUIPMENT: <EquipIcon />,
  SOIL_AMENDMENT: <SoilAmendmentIcon />,
  PESTICIDE: <PestIcon />,
  FUEL: <FuelIcon />,
  MACHINERY: <MachineIcon />,
  SEEDS: <SeedIcon />,
  OTHER: <OtherIcon />,
  LAND: <LandIcon />,
};

class ExpenseCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTypes: [],
    };

    this.addRemoveType = this.addRemoveType.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  nextPage(event) {
    event.preventDefault();
    this.props.dispatch(setSelectedExpenseTypes(this.state.selectedTypes));
    history.push('/add_expense');
  }

  addRemoveType(id) {
    let { selectedTypes } = this.state;
    if (selectedTypes.includes(id)) {
      const index = selectedTypes.indexOf(id);
      selectedTypes.splice(index, 1);
    } else {
      selectedTypes.push(id);
    }
    this.setState({
      selectedTypes,
    });
  }

  render() {
    const { expenseTypes } = this.props;

    return (
      <ManageCustomExpenseTypesSpotlight>
        <HookFormPersistProvider>
          <PureFinanceTypeSelection
            title={this.props.t('EXPENSE.ADD_EXPENSE.TITLE')}
            leadText={this.props.t('EXPENSE.ADD_EXPENSE.WHICH_TYPES_TO_RECORD')}
            cancelTitle={this.props.t('EXPENSE.ADD_EXPENSE.FLOW')}
            types={expenseTypes}
            onContinue={this.nextPage}
            onGoBack={this.props.history.back}
            progressValue={50}
            onGoToManageCustomType={() => history.push('/manage_custom_expense_types')}
            isTypeSelected={!!this.state.selectedTypes.length}
            formatTileData={(data) => {
              const { farm_id, expense_translation_key, expense_type_id } = data;

              return {
                key: expense_type_id,
                tileKey: expense_type_id,
                icon: icons[farm_id ? 'OTHER' : expense_translation_key],
                label: this.props.t(`expense:${expense_translation_key}`),
                onClick: () => this.addRemoveType(expense_type_id),
                selected: this.state.selectedTypes.includes(expense_type_id),
                className: styles.labelIcon,
              };
            }}
            useHookFormPersist={this.props.useHookFormPersist}
            iconLinkId={'manageCustomExpenseType'}
          />
        </HookFormPersistProvider>
      </ManageCustomExpenseTypesSpotlight>
    );
  }
}

ExpenseCategories.propTypes = {
  expenseTypes: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    expenseTypes: expenseTypeTileContentsSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ExpenseCategories));
