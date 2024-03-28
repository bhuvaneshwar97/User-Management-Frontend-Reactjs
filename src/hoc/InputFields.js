import React from "react";
import { ErrorMessage, useField } from 'formik';
import { Col, FormGroup, Input } from "reactstrap";
import Select from 'react-select';
import { Checkbox } from "semantic-ui-react";
import './style.css';
const InputField = ({ label, inputtype, fieldSize, mandatoryField, ...props }) => {
    const [field, meta, helpers] = useField(props);
    let inputField = <div></div>
    switch (inputtype) {
        case ('text'):
            if (label !== '') {
                inputField = <Input className={`${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'} , inputFields_style_A`} {...field} {...props} value={field.value || ''}/>
            }
            else {
                inputField = <Input className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'} , inputFields_style_A`} {...field} {...props} />
            }
            break;
        case ('password'):
            if (label !== '') {
                inputField = <Input className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'}`} {...field} {...props} />
            }
            else {
                inputField = <Input className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'} , inputFields_style_B`} {...field} {...props} />
            }
            break;
        case ('email'):
            inputField = <Input className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'} , inputFields_style_A`} {...field} {...props} />
            break;
        case ('number'):
            inputField = <Input className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'} , inputFields_style_A`} {...field} {...props} value={field.value || ''} />
            break;
        case ('date'):
            inputField = <Input className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'} , inputFields_style_A`} {...field} {...props} />
            break;
        case ('textarea'):
            inputField = <textarea className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'}`} {...field} {...props} value={field.value || ''} />
            break;
        case ('toggle'):
            inputField = (<Checkbox toggle
                label={props.myLabel}
                name={field.name}
                onChange={(e, data) => helpers.setValue(data.checked)}
                {...field} {...props}
            />
            )
            break;
        case ('select'):
            inputField = (
                <Select
                    value={field.value}
                    onChange={(e) => {
                        helpers.setValue(e)
                        props.setValue && props.setValue(e)
                    }}

                    name={field.name}
                    options={props.options}
                    {...props}
                />
            )
            break;
        case ('time'):
            inputField = <input className={`form-control ${(meta.touched && meta.error) && 'is-invalid'} ${meta.value && 'is-valid'} inputFields_style_B`} {...field} {...props} />
            break;
        default:
            break;
    }
    return (
        <React.Fragment>
            <Col md={fieldSize} className="inputFields_style_C">
                <FormGroup>
                    {label && <label htmlFor="basic-url">{label}{mandatoryField === "true" ? <span className="inputFields_style_D" >*</span> : null}</label>}
                    {inputField}
                    <ErrorMessage name={field.name} component='div' className="inputFields_style_D" />
                </FormGroup>
            </Col>
        </React.Fragment>
    )
}
export default InputField;