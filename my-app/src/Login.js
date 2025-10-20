import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from './reducers/app';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSnackbar } from "notistack";
import AES from 'crypto-js/aes';
import { useForm } from "react-hook-form";
import PF from "./_Services/publicFunction";
import Qs from "qs";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [user, setUser] = useState({ PersonalId: "", Password: "" });

  const onSubmit = (data) => {
    PF.instance({
      method: "post",
      url: PF.url2 + "/login/Getlogin",
      data: Qs.stringify({
        Action: "1",
        parameter: {
          username: data.PersonalId,
          password: data.Password
        }
      }),
    }).then(function (response) {
      const { TotalRecord, Token } = response.data
      if (TotalRecord <= 0) {
        enqueueSnackbar("帳號或密碼錯誤", { variant: "error", style: { whiteSpace: 'pre-line' } });
      } else {
        enqueueSnackbar("登入成功", { variant: "success", style: { whiteSpace: 'pre-line' } });
        dispatch(actions.UserInfo(data));
        dispatch(actions.TOKEN_SET(Token));

        localStorage.setItem("UserInfo", JSON.stringify({ PersonalId: data.PersonalId, Password: AES.encrypt(data.Password, '加密密碼').toString() }));
        localStorage.setItem("token", Token);

        navigate('/StoamchRecords'); // 在這裡手動導航至目標頁面
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ minWidth: 300, border: '1px solid #ccc' }}>
        <CardContent>
          <h2 style={{ textAlign: 'center' }}>登入</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="PersonalId"
              label="User name"
              name="PersonalId"
              autoComplete="username"
              autoFocus
              {...register("PersonalId", {
                required: { value: true, message: "必須" },
              })}
              error={!!errors.PersonalId}
              helperText={errors?.PersonalId?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="Password"
              label="Password"
              type="Password"
              id="Password"
              autoComplete="current-password"
              {...register("Password", {
                required: { value: true, message: "必須" },
              })}
              error={!!errors.Password}
              helperText={errors?.Password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ backgroundColor: '#007bff', color: '#fff', transition: 'background-color 0.3s ease' }}
            >
              登入
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;