import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core'
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik'
import { CheckboxWithLabel, TextField } from 'formik-material-ui'
import React, { Children, useState } from 'react'
import {object, mixed, number} from "yup"

const sleep=(time:number)=>new Promise((acc)=> setTimeout(acc, time))
const StepperForm = () => {
    return (
        <div style={{width:"60%", margin:"auto"}}>
            <Card>
                <CardContent>
                    <FormikStepper 
                    
                    initialValues={{
                        firstName:"",
                            lastName:"",
                            millionaire:false,
                            money:0,
                            description:""}}
                            onSubmit={async(values)=>{
                                await sleep(3000)
                                console.log("values",values)
                                
                            }}
                            
                            >
                            <FormikStep label="Personal Info">
                                <Box paddingBottom={2}>
                                    <Field fullWidth name="firstName" component={TextField} label="First Name"/>
                                </Box>
                                <Box paddingBottom={2}>
                                    <Field fullWidth name="lastName" component={TextField} label="lastName"/>              
                                </Box>
                                <Box paddingBottom={2}>
                                    <Field fullWidth name="lastName" component={TextField} label="Email"/>              
                                </Box>
                                <Box paddingBottom={2}>
                                    <Field name="millionaire" type= "checkbox" component={CheckboxWithLabel} Label={{label:"I am a millionair"}}/>
                                </Box>
                            </FormikStep>
                            <FormikStep label="Your Bank Account"
                                validationSchema={object({
                                    money: mixed().when("millionaire",{
                                        is:true,
                                        then:number().required().min(1_000_000,"Because you said you are a millionaire"),
                                        otherwise:number().required()
                                    })
                                })}
                                >
                                <Box paddingBottom={2}>
                                    <Field fullWidth name="money" type="number" component={TextField} label="All the money I have"/>
                                </Box>
                            </FormikStep>                            
                            <FormikStep label="More Info">
                            <Box paddingBottom={2}>
                                <Field fullWidth name="description" component={TextField} label="Description"/>
                            </Box>
                            </FormikStep>                            
                    </FormikStepper>
                </CardContent>
            </Card>
        </div>
    )
}

export default StepperForm

export interface FormitStepProps extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
    label:string
}
export function FormikStep ({children}:FormitStepProps){
    return <>{children}</>
}

export function FormikStepper ({children,...props}:FormikConfig<FormikValues>){
    const [completed, setCompleted]=useState(false)
    const [step,setStep]=useState(0)
    const childrenArray = Children.toArray(children) as React.ReactElement<FormitStepProps>[]
    const currentChild = childrenArray[step]
    function isLastStep(){
        return step===childrenArray.length-1;
    }

    return (
        <Formik {...props} onSubmit={async(values,helpers)=>{
            if(isLastStep()){
                await props.onSubmit(values,helpers)
                setCompleted(true)
            }else{
                setStep(s=>s+1)
            }
        }}>
        {({isSubmitting})=>(
                <Form autoComplete="off">
                <Stepper alternativeLabel activeStep={step}>
                   {childrenArray.map((child, index)=>(
                       <Step key={child.props.label} completed={step > index || completed}>
                        <StepLabel>
                            {child.props.label}
                        </StepLabel>
                    </Step>
                   ))}
                </Stepper>
                 {currentChild}
                 <Grid container spacing={4}>
                        {step >0 ? (
                    <Grid item>
                        <Button disabled={isSubmitting} variant="contained" color="primary" onClick={()=>setStep(s=>s-1)}>Back
                        </Button>
                    </Grid>):null}
                    
                    <Grid item>
                    <Button 
                    startIcon={isSubmitting ? <CircularProgress size="1rem"/>:null}
                    disabled={isSubmitting} variant="contained" color="primary" type="submit">
                     {isSubmitting ? "Submitting": isLastStep()? "Submit": "Next"}
                    </Button>
                    </Grid>
                 </Grid>
            </Form>
    )}
        </Formik>
    )
}