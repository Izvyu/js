import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from './reducers/app';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useSnackbar } from "notistack";
import AES from 'crypto-js/aes';
import { useForm } from "react-hook-form";
import PF from "./_Services/publicFunction";
import Qs from "qs";

const AnnualReportlogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [user, setUser] = useState({ PersonalId: "", Password: "" });

  const onSubmit = (data) => {
    PF.instance({
      method: "post",
      url: PF.url2 + "/login/GetloginReport",
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
        enqueueSnackbar("帳號或密碼錯誤", { variant: "error" });
      } else {
        enqueueSnackbar("登入成功", { variant: "success" });
        dispatch(actions.UserInfo(data));
        dispatch(actions.TOKEN_SET(Token));

        localStorage.setItem("UserInfo", JSON.stringify({ PersonalId: data.PersonalId, Password: AES.encrypt(data.Password, '加密密碼').toString() }));
        localStorage.setItem("token", Token);

        navigate('/AnnualReportRecords');
      }
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
      }}
    >
      <Card
        sx={{
          width: 380,
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              mb: 3,
            }}
          >
            年度健檢登入
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="PersonalId"
              label="使用者帳號"
              {...register("PersonalId", { required: { value: true, message: "必須" } })}
              error={!!errors.PersonalId}
              helperText={errors?.PersonalId?.message}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="Password"
              label="密碼"
              {...register("Password", { required: { value: true, message: "必須" } })}
              error={!!errors.Password}
              helperText={errors?.Password?.message}
              sx={{ borderRadius: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                backgroundColor: "#007bff",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              登入
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnnualReportlogin;
