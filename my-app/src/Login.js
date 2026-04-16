import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from './reducers/app';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useSnackbar } from "notistack";
import AES from 'crypto-js/aes';
import { useForm } from "react-hook-form";
import PF from "./_Services/publicFunction";
import Qs from "qs";
import LoginIcon from '@mui/icons-material/Login';

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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            background: '#fff'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: '50%',
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  alignItems: 'center'
                }}
              >
                <LoginIcon sx={{ fontSize: 32, color: '#667eea' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#333',
                  mb: 1
                }}
              >
                系統登入
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                  fontSize: '14px'
                }}
              >
                請輸入帳號和密碼登入
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="PersonalId"
                label="帳號"
                name="PersonalId"
                autoComplete="username"
                autoFocus
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: 2
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#999'
                  }
                }}
                {...register("PersonalId", {
                  required: { value: true, message: "必須輸入帳號" },
                })}
                error={!!errors.PersonalId}
                helperText={errors?.PersonalId?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="Password"
                label="密碼"
                type="password"
                id="Password"
                autoComplete="current-password"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: 2
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#999'
                  }
                }}
                {...register("Password", {
                  required: { value: true, message: "必須輸入密碼" },
                })}
                error={!!errors.Password}
                helperText={errors?.Password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                登入
              </Button>
            </form>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: '#ccc',
                mt: 2,
                fontSize: '12px'
              }}
            >
              © 2024 All Rights Reserved
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;